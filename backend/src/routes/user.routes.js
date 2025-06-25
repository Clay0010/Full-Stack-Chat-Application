import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getRecommendedUsers,
  getMyFriends,
  sendFriendRequest,
  acceptFriendRequest,
  getFriendRequest,
  getOutgoingFriendRequest,
} from "../controllers/user.controller.js";

const router = express.Router();

//apply protectRoute middleware to all routes in this router
router.use(protectRoute);

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);

router.get("/friend-requests", getFriendRequest)
router.get("/outgoing-friend-requests", getOutgoingFriendRequest);

export default router;
