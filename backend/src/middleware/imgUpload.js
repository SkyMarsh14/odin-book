import multer from "multer";

function fileFilter(req, file, cb) {
  try {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  } catch (err) {
    cb(new Error(err));
  }
}
const storage = multer.memoryStorage();
const imgUpload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 16, //16MB
  },
  fileFilter: fileFilter,
});

export default imgUpload;
