import express from "express";
import cookieParser from "cookie-parser";
import userSignupRoute from "./routes/userSignupRoute";
import userLoginRoute from "./routes/userLoginRoute";
import userLogoutRoute from "./routes/userLogoutRoute";
import allUsersGetRoute from "./routes/allUsersGetRoute";
import userPutRoute from "./routes/userPutRoute";
import userDeleteRoute from "./routes/userDeleteRoute";

const app = express();
try {
  //express middleware
  app.use(cookieParser());
  app.use(express.json());
  app.use("/signup", userSignupRoute);
  app.use("/login", userLoginRoute);
  app.use("/logout", userLogoutRoute);
  app.use("/users", allUsersGetRoute);
  app.use("/user", userPutRoute, userDeleteRoute);
  //init express server
  app.listen(process.env.PORT);
  console.log(`Connected on port ${process.env.PORT}`);
} catch (error) {
  throw new Error("Unable to connect to server");
}
