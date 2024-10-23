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
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const auth_1 = require("../middleware/auth");
const index_1 = require("../index");
const token_1 = __importDefault(require("../models/token"));
const router = express_1.default.Router();
router.get("/me", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const user = yield user_1.default.findById(userId).select("-password");
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
}));
router.post("/register", [
    (0, express_validator_1.check)("firstName", "First Name is required").isString(),
    (0, express_validator_1.check)("lastName", "Last Name is required").isString(),
    (0, express_validator_1.check)("email", "Email is required").isEmail(),
    (0, express_validator_1.check)("password", "Password with 6 or more characters required").isLength({
        min: 5,
    }),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const erros = (0, express_validator_1.validationResult)(req);
    if (!erros.isEmpty()) {
        return res.status(400).json({
            message: erros.array(),
        });
    }
    try {
        let user = yield user_1.default.findOne({
            email: req.body.email,
        });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        user = new user_1.default(req.body);
        yield user.save();
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "1d",
        });
        let otp = Math.floor(100000 + Math.random() * 900000);
        const otpToken = new token_1.default({
            userId: user.id,
            otp: otp,
        });
        yield otpToken.save();
        yield sendVerificationEmail(req.body.email, req.body.firstName, req.body.lastName, otp);
        res.cookie("auth", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000,
        });
        return res.status(200).json({ message: "User successfully created" });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: "Something went wrong",
        });
    }
}));
router.post("/verifyAccount", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const otp = parseInt(req.body.otp);
        const user = yield token_1.default.findOne({
            userId: req.userId,
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const verified = yield token_1.default.find({
            userId: req.userId,
            otp: otp,
        });
        if (!verified) {
            return res.status(403).json({ message: "Enter correct otp" });
        }
        yield token_1.default.deleteMany({
            userId: req.userId,
        });
        const updateUser = yield user_1.default.findOne({
            _id: req.userId,
        });
        if (!updateUser) {
            return res.status(404).json({ message: "User not found" });
        }
        updateUser.verified = true;
        yield updateUser.save();
        return res.status(200).json({ message: "Verified successfully" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
}));
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
