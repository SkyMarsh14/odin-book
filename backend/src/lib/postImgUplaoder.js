import { v2 as cloudinary } from "cloudinary";
import prisma from "./prisma.js";
import DataURIParser from "datauri/parser.js";
import path from "path";

const parser = new DataURIParser();
const datauri = (req) => {
  return parser.format(
    path.extname(req.file.originalname).toString(),
    req.file.buffer,
  ).content;
};
const postImgUploader = async (req, postId) => {
  try {
    const fileData = datauri(req);
    const res = await cloudinary.uploader.upload(fileData, {
      folder: process.env_CLOUDINARY_POST_FOLDER,
    });
    const file = await prisma.file.create({
      data: {
        public_id: res.public_id,
        url: res.url,
        bytes: res.bytes,
        mimetype: req.file.mimetype,
        type: "Post",
        postId,
      },
    });
    return file;
  } catch (err) {
    throw new Error(err);
  }
};

export default postImgUploader;
