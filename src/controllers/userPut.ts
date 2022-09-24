import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { verifyCookie } from "../auth/verifyCookie";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
//Tested with Postman - Admin can change anyone's name. Logged in user can only change own name
export const userPut = [
  verifyCookie,
  // Validate and sanitize user put data.
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Name cannot be empty")
    .isLength({ max: 20 })
    .withMessage("Name cannot exceed 20 characters"),
  (req: Request, res: Response) => {
    const errors = validationResult(req)
      .array()
      .map((e) => e.msg);
    if (errors.length) {
      res.status(400).json({ 400: errors });
      return;
    }
    jwt.verify(
      req.cookies.authToken,
      process.env.JWT_SECRET!,
      (err: any, authData: any) => {
        const { id } = req.params;
        const { name } = req.body;
        if (err) {
          res.status(403).json({ 403: "Token Verification Failed" });
          //currently logged in user or admin can perform put, send response with just the updated name
        } else if (authData.id === id || authData.role === "ADMIN") {
          (async () => {
            const updatedUser = await prisma.user.update({
              where: { id },
              data: { name },
            });
            res.status(200).json({ name: updatedUser.name });
          })();
        } else {
          res.status(403).json({ 403: "Forbidden" });
        }
      }
    );
  },
];
