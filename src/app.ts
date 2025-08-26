import cors from "cors";
import express, { Request, Response } from "express";
import expressSession from "express-session";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErroHandeler";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import passport from "passport";
import { envVars } from "./app/config/env";

const app = express();
app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cookieParser());
app.use(express.json());
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: envVars.FRONTEND_URL,
    credentials: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Getting Into Digital Wallet Server",
  });
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;
