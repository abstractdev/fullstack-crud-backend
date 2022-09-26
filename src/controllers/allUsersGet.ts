import { Request, Response } from "express";
import { verifyCookie } from "../auth/verifyCookie";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const allUsersGet = [
  verifyCookie,
  (req: Request, res: Response) => {
    jwt.verify(
      req.cookies.authToken,
      process.env.JWT_SECRET!,
      (err: any, authData: any) => {
        if (err) {
          res.status(403).json({ 403: "Token Verification Failed" });
          return;
        } else if (authData.role === "ADMIN") {
          (async () => {
            const users = await prisma.user.findMany({
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            });
            res.status(200).json(users);
          })();
        } else {
          res.status(403).json({ 403: "Forbidden" });
        }
      }
    );
  },
];
