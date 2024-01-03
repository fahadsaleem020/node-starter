import { NextFunction, Response } from "express";
import { IO } from "@/types/socket";

interface Options {
  next: NextFunction;
  res: Response;
  req: unknown;
  io: IO;
}

export const populateRequestObjectWithSocketIO = ({
  io,
  req,
  next,
}: Options) => {
  //@ts-ignore
  req.io = io;
  next();
};
