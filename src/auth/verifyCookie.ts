import { Request, Response, NextFunction } from "express";

export const verifyCookie = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //if JWT cookie doesn't exist, respond with 403 and return early
  if (!req.cookies.authToken) {
    res.status(403).send({ 403: "Invalid Cookie" });
    return;
  }
  return next();
};
