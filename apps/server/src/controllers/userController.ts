import { Request, Response } from "express";
import { db } from "../lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

export const signup = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array().map((error) => ({
          type: error.type,
          value: error.msg,
        })),
      });
    }
    const { email, name, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });
    const userResponse = { id: user.id, email: user.email, name: user.name };
    res.status(201).json({ status: true, userResponse });
  } catch (error) {
    res.status(500).json({ error });
  }
};
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) return res.json({ msg: "Incorrect email", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ msg: "Incorrect Password", status: false });
    }
    const token = jwt.sign({ email: user.email }, "secretkey", {
      expiresIn: "72h",
    });
    res.status(200).json({
      statusCode: 200,
      data: {
        token: token,
        email: user.email,
        userId: user.id,
      },
      message: "Logged In",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
