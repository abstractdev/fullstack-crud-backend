import { Request, Response } from "express";
import { verifyCookie } from "../auth/verifyCookie";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const userGet = [
  verifyCookie,
  (req: Request, res: Response) => {
    jwt.verify(
      req.cookies.authToken,
      process.env.JWT_SECRET!,
      (err: any, authData: any) => {
        const { id } = authData;
        if (err) {
          res.status(403).json({ 403: "Token Verification Failed" });
        } else if (authData) {
          (async () => {
            const userData = await prisma.user.findUnique({
              where: {
                id,
              },
              select: {
                name: true,
                email: true,
                role: true,
              },
            });
            res.status(200).json(userData);
          })();
        } else {
          res.status(403).json({ 403: "Forbidden" });
        }
      }
    );
  },
];
