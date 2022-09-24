import { verifyLogin } from "./../auth/verifyLogin";
import { Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const userLoginPost = [
  //Validate and sanitize login post data
  //Tested with Postman to verify error handling
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

  (req: Request, res: Response) => {
    //Extract validation error messages and send as response in an array if there are any.
    const errors = validationResult(req)
      .array()
      .map((e) => e.msg);
    if (errors.length) {
      res.status(400).json({ 400: errors });
      return;
    }
    verifyLogin(req, res);
  },
];
