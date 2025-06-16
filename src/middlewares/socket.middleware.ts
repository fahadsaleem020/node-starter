import { NextFunction, Response, type Request } from "express";
import { IO, type RequestWithIO } from "@/types/socket";
import type { Socket } from "socket.io";

export const assignSocketToReqIO = (io: IO) => {
  return (req: Request, _: Response, next: NextFunction) => {
    (req as RequestWithIO).io = io;
    next();
  };
};

//! This needs to be changed
export const authorizeUser = (socket: Socket, next: (error?: any) => void) => {
  const request = socket.request as unknown as Express.Request;
  const passport = (request.session as any)?.passport;
  passport?.user && next();
};
