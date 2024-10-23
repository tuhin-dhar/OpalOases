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
const express_validator_1 = require("express-validator");
const user_1 = __importDefault(require("../models/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../middleware/auth");
const token_1 = __importDefault(require("../models/token"));
const index_1 = require("../index");
const router = express_1.default.Router();
router.post("/login", [
    (0, express_validator_1.check)("email", "Email is required").isEmail(),
    (0, express_validator_1.check)("password", "Password is required").isLength({ min: 5 }),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    }
    const { email, password } = req.body;
    try {
        const user = yield user_1.default.findOne({
            email,
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "1d",
        });
        res.cookie("auth", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000,
        });
        return res.status(200).json({ userId: user._id });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
}));
router.get("/validate-token", auth_1.verifyToken, (req, res) => {
    res.status(200).send({ userId: req.userId });
});
router.get("/verified", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findOne({
            _id: req.userId,
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user.verified);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
}));
router.post("/verifyManual", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findOne({
            _id: req.userId,
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        let otp = Math.floor(100000 + Math.random() * 900000);
        const token = new token_1.default({
            userId: req.userId,
            otp: otp,
        });
        sendVerificationEmail(user.email, user.firstName, user.lastName, otp);
        return res.status(200).json({ message: "Success" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
}));
router.post("/logout", (req, res) => {
    res.cookie("auth", "", {
        expires: new Date(0),
    });
    return res.send();
});
exports.default = router;
const sendVerificationEmail = (to, firstName, lastName, otp) => {
    const mailOptions = {
        from: process.env.NODEMAILER_AUTH_USER,
        to,
        subject: "Verify Your Account - Your OTP Code Inside",
        text: `Dear ${firstName} ${lastName},
Thank you for registering with OpalOases. To complete your account setup, we need to verify your email address.

Please use the following One-Time Password (OTP) to verify your account:

Your OTP Code: ${otp}

To verify your account, please enter this OTP in the verification form within the next 10 minutes.

If you did not request this email, please ignore it.

Thank you for choosing OpalOases. We look forward to serving you!

Best regards,

OpalOases`,
    };
    index_1.transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log("Error sending email:", err);
        }
        else {
            console.log("Email sent successfully:", info.response);
        }
    });
};
