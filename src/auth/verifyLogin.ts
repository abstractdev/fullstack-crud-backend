import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

//Tested with Postman
export const verifyLogin = (req: Request, res: Response) => {
  const { email, password } = req.body;
  (async () => {
    //Query db for user with email. If not found, respond with 401 and return
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      res.status(401).json({ 401: "Invalid Email" });
      return;
    }
    bcrypt.compare(password, user!.password, function (err, result) {
      //if result is true, passwords is correct. Generate JWT
      if (result) {
        const token = jwt.sign(
          {
            id: user?.id,
            name: user?.name,
            email: user?.email,
            role: user?.role,
          },
          process.env.JWT_SECRET!
        );
        //place JWT inside httpOnly cookie and send cookie in response along with status code
        return res
          .cookie("authToken", token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
          })
          .status(200)
          .json({ 200: "Logged In Successfully" });
      } else {
        res.status(401).json({ 401: "Invalid Password" });
        return;
      }
    });
  })();
};
