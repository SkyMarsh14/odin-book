import express from "express";
import "dotenv/config";
import cors from "cors";
import authRouter from "./routes/authRouter.js";
import errorGlobal from "./middleware/errorGlobal.js";
import postRouter from "./routes/postRouter.js";
import protectRoute from "./middleware/protectRoute.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", authRouter);
app.use("/post", protectRoute, postRouter);
app.use(errorGlobal);

app.use("/*w", (req, res) => {
  return res.status(404).json({
    error: "Requested route does not exist",
    path: req.originalUrl,
    method: req.method,
  });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Express app started - listening on port ${PORT}`);
});
