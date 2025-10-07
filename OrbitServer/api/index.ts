import cookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import OrbitRoutes from "../apps/arthereum/OrbitRoutes";
import { config as configDotenv } from "dotenv";
configDotenv();

const production = false;
const corsOptions = production
  ? {
      exposedHeaders: ["Authorization", "Cookie"],
      credentials: true,
      origin: ["https://tryorbit.web.app", "https://orbit-test.web.app"],
    }
  : {
      exposedHeaders: ["Authorization", "Cookie"],
    };
declare global {
  namespace Express {
    interface Request {
      user: any;
      accessTokenWasExpiredSoWeCreatedAnotherOne: boolean;
      newAccessToken: string | undefined;
    }
  }
}

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 1000, // 1000 requests allowed in the 15-minute window
// });

// Apply the rate limit middleware to all routes
const app = express();

//app.use(limiter);
app.use(cookieParser());
app.disable("x-powered-by");

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

app.use(express.json({ limit: "1000kb" }));
const port = 3001;
const basePath = "/api/v1";

//
app.use(basePath + "/orbit", OrbitRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error
  res.status(500).json({ message: "Internal Server Error" });
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
module.exports = app;
