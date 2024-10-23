import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import { verifyToken } from "../middleware/auth";
import { transporter } from "../index";
import Token from "../models/token";

const router = express.Router();

router.get("/me", verifyToken, async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

router.post(
  "/register",
  [
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 5,
    }),
  ],
  async (req: Request, res: Response) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(400).json({
        message: erros.array(),
      });
    }
    try {
      let user = await User.findOne({
        email: req.body.email,
      });

      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      user = new User(req.body);
      await user.save();

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );

      let otp = Math.floor(100000 + Math.random() * 900000);

      const otpToken = new Token({
        userId: user.id as string,
        otp: otp,
      });

      await otpToken.save();

      await sendVerificationEmail(
        req.body.email,
        req.body.firstName,
        req.body.lastName,
        otp
      );

      res.cookie("auth", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });

      return res.status(200).json({ message: "User successfully created" });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: "Something went wrong",
      });
    }
  }
);

router.post(
  "/verifyAccount",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const otp = parseInt(req.body.otp);

      const user = await Token.findOne({
        userId: req.userId,
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const verified = await Token.find({
        userId: req.userId,
        otp: otp,
      });

      if (!verified) {
        return res.status(403).json({ message: "Enter correct otp" });
      }

      await Token.deleteMany({
        userId: req.userId,
      });

      const updateUser = await User.findOne({
        _id: req.userId,
      });

      if (!updateUser) {
        return res.status(404).json({ message: "User not found" });
      }
      updateUser.verified = true;

      await updateUser.save();

      return res.status(200).json({ message: "Verified successfully" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
);

export default router;

const sendVerificationEmail = (
  to: string,
  firstName: string,
  lastName: string,
  otp: number
) => {
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

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("Error sending email:", err);
    } else {
      console.log("Email sent successfully:", info.response);
    }
  });
};
