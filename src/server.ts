import { prepareProductionStance } from "./configs/prepareproductionstance.config";
import { assignSocketToReqIO } from "@/middlewares/socket.middleware";
import { prepareMigration } from "./utils/preparemigration.util";
import { authorizeUser } from "@/middlewares/socket.middleware";
import { registerEvents } from "@/utils/registerevents.util";
import { throttle } from "./middlewares/throttle.middleware";
import { sessionOptions } from "./configs/session.config";
import unknownRoutes from "@/routes/unknown.routes";
import { swagger } from "@/configs/swagger.config";
// import authRoutes from "@/routes/auth.routes";
import { log } from "@/utils/logger.util";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import { createServer } from "http";
import { Server } from "socket.io";
import status from "http-status";
import { config } from "dotenv";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";

config();
const app = express();
const httpServer = createServer(app);
const port = Number(process.env.PORT) || 3000;
const sessionMiddleware = session(sessionOptions);
const isProduction = app.get("env") === "production";

const corsOptions: CorsOptions = {
  optionsSuccessStatus: status.NO_CONTENT,
  origin: process.env.FRONTEND_DOMAIN,
  credentials: true,
};

const io = new Server(httpServer, {
  cors: corsOptions,
});

swagger(app);
prepareProductionStance({ isProduction, app, sessionOptions });
prepareMigration(isProduction);

app.use(helmet());
app.use(express.json({ limit: "50mb" }));
io.on("connection", registerEvents);
app.options("*", cors(corsOptions));
app.use(express.static("public"));
io.engine.use(sessionMiddleware);
app.use(assignSocketToReqIO(io));
app.use(express.static("dist"));
app.use(sessionMiddleware);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
io.use(authorizeUser);

app.use(morgan("dev"));
app.use(throttle("default"));
// app.use("/api", authRoutes);
app.use(unknownRoutes);

httpServer.listen(port as number, () => {
  log.info(`server is running on port: ${port}`);
  log.info(`Docs are available at \n/api/docs and /api/docs-json`);
});
