import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

export interface AuthenticatedRequest extends NextApiRequest {
  userId?: string;
}

export const authenticate = (req: AuthenticatedRequest, res: NextApiResponse, next: () => void) => {
  const token = req.cookies.authToken;

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
