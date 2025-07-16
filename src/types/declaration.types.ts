import type { IO } from "./socket.types";
import type { auth } from "@/lib/auth";

type Session = typeof auth.$Infer.Session;

declare module "express" {
  interface Request {
    session?: Session;
    io?: IO;
  }
}

declare module "socket.io" {
  interface Socket {
    session?: Session;
  }
}
