import DataURIParser from "datauri/parser.js";
import path from "path";
const parser = new DataURIParser();
const datauri = (req) => {
  return parser.format(
    path.extname(req.file.originalname).toString(),
    req.file.buffer,
  ).content;
};

export default datauri;
