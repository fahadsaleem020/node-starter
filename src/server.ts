import { populateRequestObjectWithSocketIO } from "@/middlewares/socket.middleware";
import { initializePassportLocal } from "@/configs/passportlocal.config";
import { prepareMigration } from "./utils/preparemigration";
import session, { SessionOptions } from "express-session";
import { registerEvents } from "@/utils/registerEvents";
import { dbConfig } from "./configs/connection.config";
import unknownRoutes from "@/routes/unknown.routes";
import { swagger } from "@/configs/swagger.config";
import MySQLStore from "express-mysql-session";
import authRoutes from "@/routes/auth.routes";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import { log } from "@/utils/logger";
import { createServer } from "http";
import { Server } from "socket.io";
import passport from "passport";
import { config } from "dotenv";
import express from "express";
import morgan from "morgan";

config();
const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 3000;
const isProducttion = app.get("env") === "production";

swagger(app);
initializePassportLocal();
prepareMigration(isProducttion);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_DOMAIN!,
    optionsSuccessStatus: 444,
    credentials: true,
  },
});

io.on("connection", registerEvents);

const Mysql = MySQLStore(session as any);
const store = new Mysql({
  checkExpirationInterval: 10 * 60 * 1000,
  createDatabaseTable: false,
  clearExpired: true,
  ...dbConfig,
});

const sessionOptions: SessionOptions = {
  secret: process.env.COOKIE_SECRET!,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
  saveUninitialized: false,
  resave: false,
  store: store,
};
const sessionMiddleware = session(sessionOptions);
const corsOptions: CorsOptions = {
  credentials: true,
  origin: process.env.CLIENT_DOMAIN,
};

if (isProducttion) {
  app.set("trust proxy", 1);
  sessionOptions.cookie!.secure = true;
  sessionOptions.cookie!.sameSite = "none";
}

app.use(express.urlencoded({ extended: false }));
app.options("*", cors(corsOptions));
app.use(express.static("public"));
io.engine.use(sessionMiddleware);
app.use(express.static("dist"));
app.use(sessionMiddleware);
app.use(passport.session());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use((req, res, next) =>
  populateRequestObjectWithSocketIO({
    io,
    req,
    res,
    next,
  })
);
app.use(morgan("dev"));
app.use("/api", authRoutes);
app.use(unknownRoutes);

httpServer.listen(port as number, () => {
  log.info(`server is running on port: ${port}`);
  log.info(`Docs are available at \n/api/docs and /api/docs-json`);
});
