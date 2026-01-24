import prisma from "../lib/prisma.js";
import validator from "../lib/validator.js";
import postImgUploader from "../lib/postImgUplaoder.js";
import { validationResult } from "express-validator";
import { v2 as cloudinary } from "cloudinary";
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
  delete: async (req, res, next) => {
    try {
      const postId = Number(req.params.postId);
      const post = await prisma.post.delete({
        where: {
          id: postId,
        },
        include: {
          file: true,
        },
      });
      if (post.file) {
        const { result } = await cloudinary.uploader.destroy(
          post.file.public_id,
        );
        if (!result === "ok")
          next(
            "External Server Error from Cloudinary, failed to delete the related file ",
          );
      }
      const message = post?.file
        ? `Post (ID: ${postId}) and it's related file (ID: ${post.file.id}) has been successfully deleted`
        : `Post (ID: ${postId}) has been sucessfully deleted`;
      return res.json({
        success: true,
        deletePost: post,
        msg: message,
      });
    } catch (err) {
      next(err);
    }
  },
};
export default postController;
