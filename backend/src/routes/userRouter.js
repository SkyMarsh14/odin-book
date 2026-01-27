import { Router } from "express";
import userController from "../controllers/userController.js";
import imgUpload from "../middleware/imgUpload.js";
const userRouter = Router();
userRouter.post("/follow/:userId", userController.follow);
userRouter.get("/:userId", userController.getUserInfo);
userRouter.post(
  "/profile-pic",
  imgUpload.single("imgage"),
  userController.changeProfile,
);
userRouter.post("/unfollow/:userId", userController.unfollow);
userRouter.get("/follower/:userId", userController.getFollowers);
userRouter.get("/following/:userId", userController.getFollowingUsers);
export default userRouter;
