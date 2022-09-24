import express from "express";
import { userLogoutPost } from "../controllers/userLogoutPost";
const router = express.Router();
router.post("/", userLogoutPost);

export default router;
