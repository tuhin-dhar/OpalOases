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
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const hotel_1 = __importDefault(require("../models/hotel"));
const auth_1 = require("../middleware/auth");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, //5MB
    },
});
// /api/my-hotels
router.post("/", auth_1.verifyToken, [
    (0, express_validator_1.body)("name").notEmpty().withMessage("Name is required"),
    (0, express_validator_1.body)("city").notEmpty().withMessage("City is required"),
    (0, express_validator_1.body)("country").notEmpty().withMessage("Country is required"),
    (0, express_validator_1.body)("description").notEmpty().withMessage("Description is required"),
    (0, express_validator_1.body)("type").notEmpty().withMessage("Type is required"),
    (0, express_validator_1.body)("adultCount")
        .notEmpty()
        .isNumeric()
        .withMessage("Adult count must be a number and is required"),
    (0, express_validator_1.body)("childCount")
        .notEmpty()
        .isNumeric()
        .withMessage("Child count must be a number and is required"),
    (0, express_validator_1.body)("facilities")
        .notEmpty()
        .isArray()
        .withMessage("Facilities are required"),
], upload.array("imageFiles", 6), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imageFiles = req.files;
        const newHotel = req.body;
        const imageUrls = yield uploadImages(imageFiles);
        newHotel.imageUrls = imageUrls;
        newHotel.lastUpdated = new Date();
        newHotel.userId = req.userId;
        const hotel = new hotel_1.default(newHotel);
        yield hotel.save();
        return res.status(201).send(hotel);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
}));
router.get("/", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hotels = yield hotel_1.default.find({
            userId: req.userId,
        });
        return res.json(hotels);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
    }
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id.toString();
    try {
        const hotel = yield hotel_1.default.findOne({
            _id: id,
        });
        return res.status(200).json(hotel);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error in fetching hotel" });
    }
}));
router.put("/:hotelId", auth_1.verifyToken, upload.array("imageFiles"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imageFiles = req.files;
        const updatedHotel = req.body;
        updatedHotel.lastUpdated = new Date();
        const hotel = yield hotel_1.default.findOneAndUpdate({
            _id: req.params.hotelId,
            userId: req.userId,
        }, updatedHotel, { new: true });
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        const updatedImageUrls = yield uploadImages(imageFiles);
        hotel.imageUrls = [
            ...(updatedHotel.imageUrls || []),
            ...updatedImageUrls,
        ];
        yield hotel.save();
        return res.status(201).json(hotel);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
}));
router.post("/add-room/", auth_1.verifyToken, upload.array("imageFiles", 3), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hotelId = req.body.hotelId;
        console.log(req.body);
        const files = req.files;
        const hotel = yield hotel_1.default.findOne({
            _id: hotelId,
            userId: req.userId,
        });
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        const url = yield uploadImages(files);
        if (!hotel.rooms) {
            hotel.rooms = [];
        }
        else {
            const hotelRoomsindex = hotel.rooms.length;
            hotel.rooms[hotelRoomsindex] = req.body;
            hotel.rooms[hotelRoomsindex].imageUrls = url;
            hotel.lastUpdated = new Date();
            yield hotel.save();
        }
        return res.status(200).json(hotel.rooms);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
}));
router.get("/getRooms/:hotelId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hotelId = req.params.hotelId;
        const hotel = yield hotel_1.default.findOne({
            _id: hotelId,
        });
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        return res.status(200).json(hotel.rooms);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
}));
router.get("/getRoom/:hotelId/:roomId", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hotelId, roomId } = req.params;
        const hotel = yield hotel_1.default.findOne({ _id: hotelId, "rooms._id": roomId }, { "rooms.$": 1 });
        if (!hotel) {
            return res.status(404).json({ message: "Hotel or room not found" });
        }
        // Find the specific room within the hotel
        return res.status(200).json(hotel);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
}));
router.delete("/deleteRoom/:hotelId/:roomId", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hotelId, roomId } = req.params;
        const room = yield hotel_1.default.findOneAndDelete({ _id: hotelId, "rooms._id": roomId }, { "rooms.$": 1 });
        if (!room) {
            return res.status(404).json({ message: "Hotel or room found" });
        }
        return res.status(200).json(room);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
}));
function uploadImages(imageFiles) {
    return __awaiter(this, void 0, void 0, function* () {
        const uploadPromises = imageFiles.map((image) => __awaiter(this, void 0, void 0, function* () {
            const b64 = Buffer.from(image.buffer).toString("base64");
            let dataURI = "data:" + image.mimetype + ";base64," + b64;
            const res = yield cloudinary_1.default.v2.uploader.upload(dataURI);
            return res.url;
        }));
        const imageUrls = yield Promise.all(uploadPromises);
        return imageUrls;
    });
}
exports.default = router;
