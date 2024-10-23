import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel, { HotelType, Room } from "../models/hotel";
import { verifyToken } from "../middleware/auth";
import { body, check, ExpressValidator } from "express-validator";
import { chownSync } from "fs";
import mongoose from "mongoose";
import { json } from "stream/consumers";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5MB
  },
});

// /api/my-hotels
router.post(
  "/",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Type is required"),
    body("adultCount")
      .notEmpty()
      .isNumeric()
      .withMessage("Adult count must be a number and is required"),
    body("childCount")
      .notEmpty()
      .isNumeric()
      .withMessage("Child count must be a number and is required"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities are required"),
  ],
  upload.array("imageFiles", 6),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newHotel: HotelType = req.body;

      const imageUrls = await uploadImages(imageFiles);

      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;

      const hotel = new Hotel(newHotel);
      await hotel.save();

      return res.status(201).send(hotel);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({
      userId: req.userId,
    });
    return res.json(hotels);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id.toString();

  try {
    const hotel = await Hotel.findOne({
      _id: id,
    });

    return res.status(200).json(hotel);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error in fetching hotel" });
  }
});

router.put(
  "/:hotelId",
  verifyToken,
  upload.array("imageFiles"),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const updatedHotel: HotelType = req.body;
      updatedHotel.lastUpdated = new Date();

      const hotel = await Hotel.findOneAndUpdate(
        {
          _id: req.params.hotelId,
          userId: req.userId,
        },
        updatedHotel,
        { new: true }
      );

      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }

      const updatedImageUrls = await uploadImages(imageFiles);

      hotel.imageUrls = [
        ...(updatedHotel.imageUrls || []),
        ...updatedImageUrls,
      ];

      await hotel.save();

      return res.status(201).json(hotel);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.post(
  "/add-room/",
  verifyToken,
  upload.array("imageFiles", 3),
  async (req: Request, res: Response) => {
    try {
      const hotelId = req.body.hotelId;
      console.log(req.body);
      const files = req.files as Express.Multer.File[];

      const hotel = await Hotel.findOne({
        _id: hotelId,
        userId: req.userId,
      });

      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }

      const url = await uploadImages(files);
      if (!hotel.rooms) {
        hotel.rooms = [];
      } else {
        const hotelRoomsindex = hotel.rooms.length;
        hotel.rooms[hotelRoomsindex] = req.body;
        hotel.rooms[hotelRoomsindex].imageUrls = url;
        hotel.lastUpdated = new Date();
        await hotel.save();
      }

      return res.status(200).json(hotel.rooms);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.get("/getRooms/:hotelId", async (req: Request, res: Response) => {
  try {
    const hotelId = req.params.hotelId;
    const hotel = await Hotel.findOne({
      _id: hotelId,
    });

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    return res.status(200).json(hotel.rooms);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

router.get(
  "/getRoom/:hotelId/:roomId",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { hotelId, roomId } = req.params;

      const hotel = await Hotel.findOne(
        { _id: hotelId, "rooms._id": roomId },
        { "rooms.$": 1 }
      );

      if (!hotel) {
        return res.status(404).json({ message: "Hotel or room not found" });
      }

      // Find the specific room within the hotel

      return res.status(200).json(hotel);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.delete(
  "/deleteRoom/:hotelId/:roomId",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { hotelId, roomId } = req.params;

      const room = await Hotel.findOneAndDelete(
        { _id: hotelId, "rooms._id": roomId },
        { "rooms.$": 1 }
      );

      if (!room) {
        return res.status(404).json({ message: "Hotel or room found" });
      }

      return res.status(200).json(room);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
);

async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString("base64");
    let dataURI = "data:" + image.mimetype + ";base64," + b64;
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
  });

  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}
export default router;
