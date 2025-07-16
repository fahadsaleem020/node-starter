import { assignSocketToReqIO } from "@/middlewares/socket.middleware";
import { connAuthBridge } from "@/middlewares/socket.middleware";
import { prepareMigration } from "./utils/preparemigration.util";
// import { throttle } from "./middlewares/throttle.middleware";
import { registerEvents } from "@/utils/registerevents.util";
import unknownRoutes from "@/routes/unknown.routes";
import { swagger } from "@/configs/swagger.config";
import { toNodeHandler } from "better-auth/node";
import { logger } from "@/utils/logger.util";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import { env } from "./utils/env.util";
import { createServer } from "http";
import { Server } from "socket.io";
import "@/types/declaration.types";
import { auth } from "./lib/auth";
import { config } from "dotenv";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";

config();
const app = express();
const httpServer = createServer(app);
const port = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === "production";

const corsOptions: CorsOptions = {
  origin: env.FRONTEND_DOMAIN,
  credentials: true,
};

const io = new Server(httpServer, {
  cors: corsOptions,
});

swagger(app);
prepareMigration(isProduction);

app.use(helmet());
io.on("connection", registerEvents);
app.use(express.static("public"));
app.use(assignSocketToReqIO(io));
app.use(express.static("dist"));
app.use(cors(corsOptions));
app.use(cookieParser());
io.use(connAuthBridge);

app.use(morgan("dev"));
app.all("/api/auth/*splat", toNodeHandler(auth));

// app.use(throttle("default")); enable after database connection
app.use(express.json());

app.use(unknownRoutes);

httpServer.listen(port as number, () => {
  logger.info(`server is running on port: ${port}`);
  logger.info(`Docs are available at \n/api/docs and /api/docs-json`);
});
