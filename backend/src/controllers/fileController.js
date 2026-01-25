import { v2 as cloudinary } from "cloudinary";
import prisma from "../lib/prisma.js";
import datauri from "../lib/datauri.js";

const fileController = {
  delete: async (req, res, next) => {
    try {
      const file = await prisma.file.delete({
        where: {
          id: +req.params.fileId,
        },
      });
      const destory = await cloudinary.uploader.destroy(file.public_id);
      return res.json({ file, destory });
    } catch (err) {
      next(err);
    }
  },
  replace: async (req, res, next) => {
    try {
      const fileDataUri = datauri(req);
      const oldFile = await prisma.file.findUnique({
        where: {
          id: +req.params.fileId,
        },
      });
      const destroyedFile = await cloudinary.uploader.destroy(
        oldFile.public_id,
      );
      const uploadedFile = await cloudinary.uploader.upload(fileDataUri, {
        folder: process.env.CLOUDINARY_POST_FOLDER,
      });
      const updatedFile = await prisma.file.update({
        where: {
          id: +req.params.fileId,
        },
        data: {
          public_id: uploadedFile.public_id,
          url: uploadedFile.url,
          bytes: uploadedFile.bytes,
          mimetype: req.file.mimetype,
          type: "Post",
        },
      });
      return res.json({ updatedFile, destroyedFile, uploadedFile });
    } catch (err) {
      next(err);
    }
  },
};

export default fileController;
