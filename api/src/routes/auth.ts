import { error } from "console";
import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middleware/auth";
import Token from "../models/token";
import { transporter } from "../index";

const router = express.Router();

router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").isLength({ min: 5 }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({
        email,
      });

      if (!user) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );

      res.cookie("auth", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });

      return res.status(200).json({ userId: user._id });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
  res.status(200).send({ userId: req.userId });
});

router.get("/verified", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({
      _id: req.userId,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user.verified);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

router.post(
  "/verifyManual",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const user = await User.findOne({
        _id: req.userId,
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let otp = Math.floor(100000 + Math.random() * 900000);

      const token = new Token({
        userId: req.userId,
        otp: otp,
      });

      sendVerificationEmail(user.email, user.firstName, user.lastName, otp);

      return res.status(200).json({ message: "Success" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.post("/logout", (req: Request, res: Response) => {
  res.cookie("auth", "", {
    expires: new Date(0),
  });

  return res.send();
});

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
