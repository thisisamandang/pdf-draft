import { body, ValidationChain } from "express-validator";
import { db } from "../lib/db";

export const signupValidator: ValidationChain[] = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail()
    .custom(async (value) => {
      const existingUser = await db.user.findUnique({
        where: { email: value },
      });
      if (existingUser) {
        throw new Error("This email address is already registered.");
      }
    }),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long."),
];
