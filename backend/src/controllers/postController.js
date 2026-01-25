import prisma from "../lib/prisma.js";
import validator from "../lib/validator.js";
import postImgUploader from "../lib/postImgUplaoder.js";
import { validationResult } from "express-validator";
import { v2 as cloudinary } from "cloudinary";
const postController = {
  getPost: async (req, res, next) => {
    try {
      const post = await prisma.post.findUnique({
        where: {
          id: +req.params.postId,
        },
        include: {
          file: true,
        },
      });
      return res.json(post);
    } catch (err) {
      next(err);
    }
  },
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
            ...(content && { content: content }), // Spread operator to add content property only if it exists
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
  edit: [
    validator.postValidation,
    async (req, res, next) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const postId = Number(req.params.postId);
        const post = await prisma.post.update({
          where: {
            id: postId,
          },
          data: {
            content: req.body.content,
          },
          include: {
            file: true,
          },
        });
        return res.json({
          sucess: true,
          updatedPost: post,
          msg: `Post (ID: ${postId}) has been successfully updated`,
        });
      } catch (err) {
        next(err);
      }
    },
  ],
  addFile: async (req, res, next) => {
    try {
      const postId = +req.params.postId;
      const fileData = await postImgUploader(req, postId);
      const post = await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          file: {
            connect: {
              id: fileData.id,
            },
          },
        },
        include: {
          file: true,
        },
      });
      return res.json(post);
    } catch (err) {
      next(err);
    }
  },
};
export default postController;
