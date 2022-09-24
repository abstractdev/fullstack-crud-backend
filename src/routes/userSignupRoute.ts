import express from "express";
import { userSignupPost } from "../controllers/userSignupPost";
const router = express.Router();
router.post("/", userSignupPost);

export default router;
