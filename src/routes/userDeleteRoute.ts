import express from "express";
import { userDelete } from "../controllers/userDelete";
const router = express.Router();
router.delete("/:id", userDelete);

export default router;
