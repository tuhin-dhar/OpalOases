import express, { Request, Response } from "express";
import { verifyToken } from "../middleware/auth";
import Hotel, { HotelType } from "../models/hotel";

const router = express.Router();

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({
      bookings: {
        $elemMatch: {
          userId: req.userId,
        },
      },
    });

    const results = hotels.map((hotel) => {
      const userBooking = hotel.bookings.filter(
        (booking) => booking.userId === req.userId
      );
      const hotelWithUserBookings: HotelType = {
        ...hotel.toObject(),
        bookings: userBooking,
      };

      return hotelWithUserBookings;
    });

    return res.status(200).json(results);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to fetch bookings" });
  }
});

export default router;
