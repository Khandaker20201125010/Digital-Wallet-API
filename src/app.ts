import cors from "cors";
import express, { Request, Response } from "express";
import expressSession from "express-session";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErroHandeler";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import passport from "passport";

const app = express();

app.use(
  expressSession({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Getting Into Digital Wallet Server",
  });
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;
