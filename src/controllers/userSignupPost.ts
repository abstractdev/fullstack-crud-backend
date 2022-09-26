import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { body, check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

export const userSignupPost = [
  //Validate and sanitize signup post data
  //Tested with Postman to verify error handling
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Name cannot be empty")
    .isLength({ max: 20 })
    .withMessage("Name cannot exceed 20 characters"),
  body("email")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Email cannot be empty")
    .isLength({ max: 20 })
    .withMessage("Email cannot exceed 20 characters")
    .isEmail()
    .withMessage("Email format is invalid"),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Password cannot be empty")
    .isLength({ max: 20 })
    .withMessage("Password cannot exceed 20 characters"),
  check("passwordConfirmation", "Passwords do not match")
    .exists()
    .custom((value, { req }) => value === req.body.password),

  (req: Request, res: Response) => {
    //Extract validation error messages and send as response in an array if there are any.
    const errors = validationResult(req)
      .array()
      .map((e) => e.msg);
    if (errors.length) {
      res.status(400).json({ 400: errors });
      return;
    }
    const { name, email, password, role } = req.body;
    (async () => {
      //If email already exists in db, early return
      const count = await prisma.user.count({
        where: {
          email,
        },
      });
      if (count) {
        res.status(403).json({ 403: "Email has already been registered" });
        return;
      }
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        //If err, early return
        if (err) {
          res.status(400).json({ 400: "Bad Request" });
          return;
        }
        //Hash the password, create user database entry with data from req.body, then send status 200 if successful
        (async () => {
          const user = await prisma.user.create({
            data: {
              name,
              email,
              password: hashedPassword,
              role,
            },
          });
          if (user) {
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
              .json({ 200: "User Created" });
          } else {
            res.status(400).json({ 400: "Bad Request" });
          }
        })();
      });
    })();
  },
];
