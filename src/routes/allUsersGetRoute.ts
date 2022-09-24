import express from "express";
import { allUsersGet } from "../controllers/allUsersGet";
const router = express.Router();
router.get("/", allUsersGet);

export default router;
