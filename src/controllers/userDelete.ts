import { Request, Response } from "express";
import { verifyCookie } from "../auth/verifyCookie";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
//Tested with Postman - Admin can delete any user. Cannot delete themseleves.
export const userDelete = [
  verifyCookie,
  (req: Request, res: Response) => {
    jwt.verify(
      req.cookies.authToken,
      process.env.JWT_SECRET!,
      (err: any, authData: any) => {
        const { id } = req.params;
        if (err) {
          res.status(403).json({ 403: "Token Verification Failed" });
        } else if (authData.role === "ADMIN" && authData.id !== id) {
          (async () => {
            const deletedUser = await prisma.user.delete({
              where: { id },
            });
            res.status(200).json({ deleted: deletedUser });
          })();
        } else {
          res.status(403).json({ 403: "Forbidden" });
        }
      }
    );
  },
];
