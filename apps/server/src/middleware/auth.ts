import { Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");

export const isAuth = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = req.get("Authorization").split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "secretkey");
    console.log(decodedToken);
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" });
  }
  if (!decodedToken) {
    const error = new Error("Not authenticated");
    res.status(401);
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
