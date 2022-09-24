import express from "express";
import { userPut } from "../controllers/userPut";
const router = express.Router();
router.put("/:id", userPut);

export default router;
