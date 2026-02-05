import express from "express";
import "dotenv/config";
import cors from "cors";
import "./config/passport.js";
import cookieParser from "cookie-parser";
import cookieConfig from "./config/cookie.js";
import session from "express-session";
import passport from "passport";
import authRouter from "./routes/authRouter.js";
import errorGlobal from "./middleware/errorGlobal.js";
import postRouter from "./routes/postRouter.js";
import userRouter from "./routes/userRouter.js";
import fileRouter from "./routes/fileRouter.js";
import isAuthenticated from "./middleware/isAuthenticated.js";

const app = express();
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  }),
);
app.use(
  session({
    secret: process.env.TOKEN_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      cookieConfig,
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.post("/login", passport.authenticate("local"));
app.use("/", authRouter);
app.use("/post", isAuthenticated, postRouter);
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
