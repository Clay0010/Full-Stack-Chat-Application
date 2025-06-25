import express from "express";
import {
  login,
  signup,
  logout,
  onboard,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/signup", signup);

// we used next() method so after the protectRoute function runs successfully, it then will run the onboard function

router.post("/onboarding", protectRoute, onboard);

// check if user is logged in or not
router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;
