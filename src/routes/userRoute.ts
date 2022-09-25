import express from "express";
import { userSignupPost } from "../controllers/userSignupPost";
import { userLoginPost } from "../controllers/userLoginPost";
import { userLogoutPost } from "../controllers/userLogoutPost";
import { userPut } from "../controllers/userPut";
import { userDelete } from "../controllers/userDelete";
const router = express.Router();

router.post("/signup", userSignupPost);
router.post("/login", userLoginPost);
router.post("/logout", userLogoutPost);
router.put("/:id", userPut);
router.delete("/:id", userDelete);

export default router;
