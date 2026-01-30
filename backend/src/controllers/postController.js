import prisma from "../lib/prisma.js";
import validator from "../lib/validator.js";
import postImgUploader from "../lib/postImgUplaoder.js";
import { validationResult } from "express-validator";
import { v2 as cloudinary } from "cloudinary";
const postController = {
  getPost: async (req, res) => {
    const post = await prisma.post.findUnique({
      where: {
        id: +req.params.postId,
      },
      include: {
        file: true,
      },
    });
    return res.json(post);
  },
  getComment: async (req, res) => {
    const postId = +req.params.postId;
    const comments = await prisma.post.findMany({
      where: {
        parentPostId: postId,
      },
      include: {
        file: true,
      },
    });
    return res.json(comments);
  },
  getUserPost: async (req, res) => {
    const posts = await prisma.user.findUnique({
      where: {
        id: +req.user.id,
      },
      select: {
        posts: {
          include: {
            file: true,
          },
        },
      },
    });
    return res.json(posts);
  },
  create: [
    validator.postValidation,
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      let response = {};
      const content = req.body?.content;
      const file = req?.file;
      const parentPostId = +req.body?.parentPostId;

      const post = await prisma.post.create({
        data: {
          authorId: req.user.id,
          ...(content && { content: content }), // Spread operator to add content property only if it exists
          ...(parentPostId && { parentPostId: parentPostId }),
        },
      });
      response.post = post;
      if (file) {
        const fileData = await postImgUploader(req, post.id);
        response.file = fileData;
      }
      return res.json(response);
    },
  ],
  delete: async (req, res) => {
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
      const { result } = await cloudinary.uploader.destroy(post.file.public_id);
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
  },
  edit: [
    validator.postValidation,
    async (req, res, next) => {
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
    },
  ],
  addFile: async (req, res, next) => {
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
  },
  likePost: async (req, res) => {
    const postId = +req.params.postId;
    const like = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        likedBy: {
          connect: {
            id: req.user.id,
          },
        },
      },
      include: {
        likedBy: true,
      },
    });
    return res.json(like);
  },
  unlikePost: async (req, res) => {
    const postId = +req.params.postId;
    const unlike = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        likedBy: {
          disconnect: {
            id: req.user.id,
          },
        },
      },
    });
    return res.json(unlike);
  },
  getLikedBy: async (req, res) => {
    const postId = +req.params.postId;
    const users = await prisma.post.findUniqueOrThrow({
      where: {
        id: postId,
      },
      select: {
        likedBy: {
          include: {
            file: true,
          },
        },
      },
    });
    if (!users) {
      return res.json({ msg: "Not one has liked the post yet", users: [] });
    }
    return res.json(users);
  },
};
export default postController;
