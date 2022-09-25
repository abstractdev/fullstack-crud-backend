import express from "express";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute";
import allUsersGetRoute from "./routes/allUsersGetRoute";

const app = express();
try {
  //express middleware
  app.use(cookieParser());
  app.use(express.json());
  app.use("/user", userRoute);
  app.use("/users", allUsersGetRoute);
  //init express server
  app.listen(process.env.PORT);
  console.log(`Connected on port ${process.env.PORT}`);
} catch (error) {
  throw new Error("Unable to connect to server");
}
