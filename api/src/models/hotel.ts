import mongoose from "mongoose";

export type BookingType = {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  room: Room;
  checkIn: Date;
  checkOut: Date;
  totalCost: number;
};

export type HotelType = {
  _id: string;
  userId: string;
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  rooms?: Room[];
  facilities: string[];
  starRating: number;
  imageUrls: string[];
  lastUpdated: Date;
  bookings: BookingType[];
};

export type Beds = {
  bedType: string;
  numberOfBeds: number;
};

export type Room = {
  _id: string;
  roomName: string;
  roomType: string;
  pricePerNight: number;
  numberOfRooms: number;
  beds: Beds[];
  roomSize?: number;
  adultCount: number;
  childCount: number;
  anmeties: string[];
  imageUrls?: string[];
};

const bedSchema = new mongoose.Schema<Beds>({
  bedType: { type: String, required: true },
  numberOfBeds: { type: Number, required: true },
});

const roomSchema = new mongoose.Schema<Room>({
  roomName: { type: String, required: true },
  roomType: { type: String, required: true },
  pricePerNight: { type: Number, required: true },
  numberOfRooms: { type: Number, required: true },
  beds: { type: [bedSchema], required: true },
  roomSize: { type: Number },
  adultCount: { type: Number, required: true },
  childCount: { type: Number, required: true },
  anmeties: [{ type: String, required: true }],
  imageUrls: [{ type: String }],
});

const bookingSchema = new mongoose.Schema<BookingType>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  room: roomSchema,
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  userId: { type: String, required: true },
  totalCost: {
    type: Number,
    required: true,
  },
});

const hotelSchema = new mongoose.Schema<HotelType>({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },

  facilities: [
    {
      type: String,
      required: true,
    },
  ],
  starRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  rooms: [roomSchema],
  imageUrls: [
    {
      type: String,
      required: true,
    },
  ],
  lastUpdated: { type: Date, required: true },
  bookings: [bookingSchema],
});

const Hotel = mongoose.model<HotelType>("Hotel", hotelSchema);

export default Hotel;
