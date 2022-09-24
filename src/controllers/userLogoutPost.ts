import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { verifyCookie } from "../auth/verifyCookie";

export const userLogoutPost = [
  verifyCookie,
  (req: Request, res: Response) => {
    jwt.verify(req.cookies.authToken, process.env.JWT_SECRET!, (err: any) => {
      if (err) {
        res.status(403).json({ 403: "Token Verification Failed" });
      } else {
        return res
          .cookie("authToken", "", {
            maxAge: 0,
            httpOnly: true,
            sameSite: "none",
            secure: true,
          })
          .status(200)
          .json({ 200: "Successfully logged out" });
      }
    });
  },
];
