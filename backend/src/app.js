import express from "express";
import "dotenv/config";
import cors from "cors";
import "./config/passport.js";
import cookieSession from "cookie-session";
import passport from "passport";
import authRouter from "./routes/authRouter.js";
import errorGlobal from "./middleware/errorGlobal.js";
import postRouter from "./routes/postRouter.js";
import userRouter from "./routes/userRouter.js";
import fileRouter from "./routes/fileRouter.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "github-auth-session",
    keys: ["key1", "key2"],
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/", authRouter);
app.use("/post", passport.authenticate("jwt", { session: false }), postRouter);
app.use("/user", passport.authenticate("jwt", { session: false }), userRouter);
app.use("/file", passport.authenticate("jwt", { session: false }), fileRouter);
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
