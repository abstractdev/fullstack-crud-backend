import express from "express";
import { userLoginPost } from "../controllers/userLoginPost";
const router = express.Router();
router.post("/", userLoginPost);

export default router;
