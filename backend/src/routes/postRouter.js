import { Router } from "express";
import postController from "../controllers/postController.js";
import imgUpload from "../middleware/imgUpload.js";
const postRouter = Router();

postRouter.post("/", imgUpload.single("image"), postController.create);
postRouter.delete("/:postId", postController.delete);
export default postRouter;
