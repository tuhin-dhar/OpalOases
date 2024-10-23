"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hotel_1 = __importDefault(require("../models/hotel"));
const express_validator_1 = require("express-validator");
const stripe_1 = __importDefault(require("stripe"));
const auth_1 = require("../middleware/auth");
const stripe = new stripe_1.default(process.env.STRIPE_API_KEY);
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hotels = yield hotel_1.default.find().sort("-lastUpdated");
        return res.status(200).json(hotels);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
}));
router.get("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = constructSearchQuery(req.query);
        let sortOptions = {};
        let sortStage = {};
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
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
        const skip = (pageNumber - 1) * pageSize;
        const hotels = yield hotel_1.default.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(pageSize);
        const total = yield hotel_1.default.countDocuments(query);
        const response = {
            data: hotels,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / pageSize),
            },
        };
        return res.status(200).json(response);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
}));
router.get("/:id", [(0, express_validator_1.param)("id").notEmpty().withMessage("Hotel ID is required")], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ erros: errors.array() });
    }
    const id = req.params.id.toString();
    try {
        const hotel = yield hotel_1.default.findById(id);
        return res.status(200).json(hotel);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
}));
router.post("/:hotelId/:roomId/bookings/payment-intent", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. total cost
    // 2. hotelId
    // 3. userId
    const { numberOfNights } = req.body;
    const hotelId = req.params.hotelId;
    const roomId = req.params.roomId;
    console.log(hotelId, roomId);
    const userId = req.userId;
    const room = yield hotel_1.default.findOne({ _id: hotelId, "rooms._id": roomId }, { "rooms.$": 1 });
    if (!room || !room.rooms) {
        return res.status(400).json({ message: "Hotel or room not found" });
    }
    console.log(room);
    const totalCost = room.rooms[0].pricePerNight * numberOfNights;
    const paymentIntent = yield stripe.paymentIntents.create({
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
}));
router.post("/:hotelId/:roomId/bookings", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const paymentIntentId = req.body.paymentIntentId;
        const paymentIntent = yield stripe.paymentIntents.retrieve(paymentIntentId);
        if (!paymentIntent) {
            return res.status(400).json({ message: "Payment was not found" });
        }
        if (paymentIntent.metadata.hotelId !== req.params.hotelId ||
            paymentIntent.metadata.roomId !== req.params.roomId ||
            paymentIntent.metadata.userId !== req.userId) {
            return res.status(400).json({ message: "Payment intent mismatch" });
        }
        if (paymentIntent.status !== "succeeded") {
            return res.status(400).json({
                message: `Payment intent not succeeded. Status ${paymentIntent.status}`,
            });
        }
        const newBooking = Object.assign(Object.assign({}, req.body), { userId: req.userId });
        const hotel = yield hotel_1.default.findById(req.params.hotelId);
        if (!hotel) {
            return res.status(400).json({ message: "Hotel not found" });
        }
        const room = (_a = hotel.rooms) === null || _a === void 0 ? void 0 : _a.find((room) => room._id.toString() === req.params.roomId);
        if (!room) {
            return res.status(400).json({ message: "Room not found" });
        }
        const updateHotel = yield hotel_1.default.findOneAndUpdate({ _id: req.params.hotelId }, {
            $push: {
                bookings: newBooking,
            },
        });
        if (!updateHotel) {
            return res.status(400).json({ message: "Hotel not found" });
        }
        yield hotel.save();
        return res.status(200).send();
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
}));
const constructSearchQuery = (queryParams) => {
    let constructedQuery = {};
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
            ? queryParams.stars.map((star) => parseInt(star))
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
exports.default = router;
