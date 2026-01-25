import { v2 as cloudinary } from "cloudinary";
import prisma from "./prisma.js";
import datauri from "./datauri.js";

const postImgUploader = async (req, postId) => {
  try {
    const postFolder = process.env.CLOUDINARY_POST_FOLDER;
    const fileData = datauri(req);
    const res = await cloudinary.uploader.upload(fileData, {
      folder: postFolder,
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
