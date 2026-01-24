import { Router } from "express";
import postController from "../controllers/postController.js";
import imgUpload from "../middleware/imgUpload.js";
const postRouter = Router();

postRouter.post("/create", imgUpload.single("image"), postController.create);

export default postRouter;
