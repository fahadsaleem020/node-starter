import { populateRequestObjectWithSocketIO } from "@/middlewares/socket.middleware";
import { initializePassportLocal } from "@/configs/passportlocal.config";
import session, { SessionOptions } from "express-session";
import { registerEvents } from "@/utils/registerEvents";
import migrationRoute from "@/routes/migrate.routes";
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
const port = process.env.PORT || 3000;
const httpServer = createServer(app);

swagger(app);
initializePassportLocal();

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_DOMAIN!,
    optionsSuccessStatus: 444,
    credentials: true,
  },
});

io.on("connection", registerEvents);
app.use("/api", migrationRoute);

const Mysql = MySQLStore(session as any);
const store = new Mysql({
  checkExpirationInterval: 10 * 60 * 1000,
  password: process.env.password!,
  database: process.env.database!,
  createDatabaseTable: false,
  host: process.env.host!,
  user: process.env.user!,
  clearExpired: true,
});

const sessionOptions: SessionOptions = {
  secret: process.env.COOKIE_SECRET!,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
  resave: false,
  saveUninitialized: false,
  store: store,
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1);
  sessionOptions.cookie!.secure = true;
  sessionOptions.cookie!.sameSite = "lax";
  sessionOptions.cookie!.domain = process.env.CLIENT_DOMAIN!;
  sessionOptions.cookie!.httpOnly = true;
}

const sessionMiddleware = session(sessionOptions);

const corsOptions: CorsOptions = {
  credentials: true,
  origin: process.env.CLIENT_DOMAIN!,
};

io.engine.use(sessionMiddleware);
app.options("*", cors(corsOptions));
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
