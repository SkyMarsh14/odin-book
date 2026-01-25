import { Router } from "express";
import fileController from "../controllers/fileController.js";
import imgUpload from "../middleware/imgUpload.js";
const fileRouter = Router();

fileRouter.delete("/:fileId", fileController.delete);
fileRouter.put("/:fileId", imgUpload.single("image"), fileController.replace);

export default fileRouter;
