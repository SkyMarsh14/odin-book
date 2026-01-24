import prisma from "../lib/prisma.js";
import validator from "../lib/validator.js";
import postImgUploader from "../lib/postImgUplaoder.js";
import { validationResult } from "express-validator";
const postController = {
  create: [
    validator.postValidation,
    async (req, res, next) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        let response = {};
        const content = req.body?.content;
        const file = req?.file;

        const post = await prisma.post.create({
          data: {
            authorId: req.user.id,
            ...(content && { content: content }),
          },
        });
        response.post = post;
        if (file) {
          const fileData = await postImgUploader(req, post.id);
          response.file = fileData;
        }
        return res.json(response);
      } catch (err) {
        next(err);
      }
    },
  ],
};
export default postController;
