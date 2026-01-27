import { v2 as cloudinary } from "cloudinary";
import prisma from "./prisma.js";
import datauri from "./datauri.js";

const profileFolder = process.env.CLOUDINARY_PROFILE_FOLDER;
const fileType = "Profile";
const profileImgUploader = {
  create: async (req, userId) => {
    try {
      const fileData = datauri(req);
      const res = await cloudinary.uploader.upload(fileData, {
        folder: profileFolder,
      });
      const file = await prisma.file.create({
        data: {
          public_id: res.public_id,
          url: res.url,
          bytes: res.bytes,
          mimetype: req.file.mimetype,
          type: fileType,
          userId,
        },
      });
      return file;
    } catch (err) {
      throw new Error(err);
    }
  },
  replace: async (req, userId) => {
    const fileData = datauri(req);
    const oldFile = await prisma.file.findUnique({
      where: {
        userId: +userId,
      },
    });
    const destory = await cloudinary.uploader.destroy(oldFile.public_id);
    const res = await cloudinary.uploader.upload(fileData, {
      folder: profileFolder,
    });
    const file = await prisma.file.update({
      where: {
        id: oldFile.id,
      },
      data: {
        public_id: res.public_id,
        url: res.url,
        bytes: res.bytes,
        mimetype: req.file.mimetype,
        type: fileType,
      },
    });
    return file;
  },
};

export default profileImgUploader;
