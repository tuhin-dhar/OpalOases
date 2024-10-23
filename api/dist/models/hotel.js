"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bedSchema = new mongoose_1.default.Schema({
    bedType: { type: String, required: true },
    numberOfBeds: { type: Number, required: true },
});
const roomSchema = new mongoose_1.default.Schema({
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
const bookingSchema = new mongoose_1.default.Schema({
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
const hotelSchema = new mongoose_1.default.Schema({
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
const Hotel = mongoose_1.default.model("Hotel", hotelSchema);
exports.default = Hotel;
