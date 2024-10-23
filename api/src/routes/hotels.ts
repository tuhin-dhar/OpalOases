import express, { Request, Response } from "express";
import Hotel, { BookingType, HotelType } from "../models/hotel";
import { param, validationResult } from "express-validator";
import Stripe from "stripe";
import { verifyToken } from "../middleware/auth";
import { json } from "stream/consumers";

const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

const router = express.Router();

export type HotelSearchResponse = {
  data: HotelType[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
};

export type PaymentIntentResponse = {
  paymentIntentId: string;
  clientSecret: string;
  totalCost: number;
};

router.get("/", async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find().sort("-lastUpdated");

    return res.status(200).json(hotels);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/search", async (req: Request, res: Response) => {
  try {
    const query = constructSearchQuery(req.query);

    let sortOptions: any = {};
    let sortStage: any = {};

    switch (req.query.sortOption) {
      case "starRating":
        sortOptions = { starRating: -1 };
        break;
      case "pricePerNightAsc":
        sortOptions = { "rooms.pricePerNight": 1 };
        sortStage = { $sort: { "rooms.pricePerNight": 1 } };
        break;
      case "pricePerNightDesc":
        sortOptions = { "rooms.pricePerNight": -1 };
        sortStage = { $sort: { "rooms.pricePerNight": -1 } };
        break;
      default:
        sortOptions = { starRating: -1 }; // Default sort option
        break;
    }

    const pageSize = 5;
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );
    const skip = (pageNumber - 1) * pageSize;

    const hotels = await Hotel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    const total = await Hotel.countDocuments(query);

    const response: HotelSearchResponse = {
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };

    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Hotel ID is required")],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ erros: errors.array() });
    }

    const id = req.params.id.toString();

    try {
      const hotel = await Hotel.findById(id);
      return res.status(200).json(hotel);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.post(
  "/:hotelId/:roomId/bookings/payment-intent",
  verifyToken,
  async (req: Request, res: Response) => {
    // 1. total cost
    // 2. hotelId
    // 3. userId

    const { numberOfNights } = req.body;
    const hotelId = req.params.hotelId;
    const roomId = req.params.roomId;
    console.log(hotelId, roomId);
    const userId = req.userId;

    const room = await Hotel.findOne(
      { _id: hotelId, "rooms._id": roomId },
      { "rooms.$": 1 }
    );
    if (!room || !room.rooms) {
      return res.status(400).json({ message: "Hotel or room not found" });
    }

    console.log(room);

    const totalCost = room.rooms[0].pricePerNight * numberOfNights;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCost * 100,
      currency: "inr",
      metadata: {
        hotelId,
        roomId,
        userId,
      },
    });

    if (!paymentIntent.client_secret) {
      return res.status(500).json({ message: "Error creating payment intent" });
    }

    const response = {
      room: room.rooms[0],
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret.toString(),
      totalCost,
    };

    return res.send(response);
  }
);

router.post(
  "/:hotelId/:roomId/bookings",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const paymentIntentId = req.body.paymentIntentId;
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId as string
      );

      if (!paymentIntent) {
        return res.status(400).json({ message: "Payment was not found" });
      }

      if (
        paymentIntent.metadata.hotelId !== req.params.hotelId ||
        paymentIntent.metadata.roomId !== req.params.roomId ||
        paymentIntent.metadata.userId !== req.userId
      ) {
        return res.status(400).json({ message: "Payment intent mismatch" });
      }

      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({
          message: `Payment intent not succeeded. Status ${paymentIntent.status}`,
        });
      }

      const newBooking: BookingType = {
        ...req.body,
        userId: req.userId,
      };

      const hotel = await Hotel.findById(req.params.hotelId);
      if (!hotel) {
        return res.status(400).json({ message: "Hotel not found" });
      }

      const room = hotel.rooms?.find(
        (room) => room._id.toString() === req.params.roomId
      );

      if (!room) {
        return res.status(400).json({ message: "Room not found" });
      }

      const updateHotel = await Hotel.findOneAndUpdate(
        { _id: req.params.hotelId },
        {
          $push: {
            bookings: newBooking,
          },
        }
      );

      if (!updateHotel) {
        return res.status(400).json({ message: "Hotel not found" });
      }

      await hotel.save();

      return res.status(200).send();
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
);

const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};

  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { country: new RegExp(queryParams.destination, "i") },
    ];
  }

  if (queryParams.adultCount) {
    constructedQuery["rooms.adultCount"] = {
      $gte: parseInt(queryParams.adultCount),
    };
  }

  if (queryParams.childCount) {
    constructedQuery["rooms.childCount"] = {
      $gte: parseInt(queryParams.childCount),
    };
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }

  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : [parseInt(queryParams.stars)];

    constructedQuery.starRating = { $in: starRatings };
  }

  if (queryParams.maxPrice) {
    constructedQuery["rooms.pricePerNight"] = {
      $lte: parseInt(queryParams.maxPrice),
    };
  }

  return constructedQuery;
};

export default router;
