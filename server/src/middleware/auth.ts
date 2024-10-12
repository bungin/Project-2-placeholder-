import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: number;
  username: string;
}

// Extend the Request type to include the `user` property
declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Skipping authentication for the signup route
  if (req.path === "/users" && req.method === "POST") {
    return next(); // Skip authentication for this route
  }

  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    const secretKey = process.env.JWT_SECRET_KEY || "";
    console.log("hitting auth middleware");

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(401); // Unauthorized
      }
      req.user = user as JwtPayload;
      return next();
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};
