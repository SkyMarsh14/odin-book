import { Router } from "express";
import postController from "../controllers/postController.js";
import imgUpload from "../middleware/imgUpload.js";
const postRouter = Router();

postRouter.get("/comment/:postId", postController.getComment);
postRouter.get("/user", postController.getUserPost);
postRouter.get("/likedBy/:postId", postController.getLikedBy);
postRouter.post("/", imgUpload.single("image"), postController.create);
postRouter.post("/like/:postId", postController.likePost);
postRouter.post("/unlike/:postId", postController.unlikePost);
postRouter.post("/:postId", postController.edit);
postRouter.delete("/:postId", postController.delete);
postRouter.get("/:postId", postController.getPost);
postRouter.post(
  "/addFile/:postId",
  imgUpload.single("image"),
  postController.addFile,
);
export default postRouter;
