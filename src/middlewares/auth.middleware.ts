import { Request, Response, NextFunction } from "express";
import { getHttpStatusCode } from "@/utils/auth";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(getHttpStatusCode("UNAUTHORIZED")).send("unAuthorized");
};

export const isUnAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isUnauthenticated()) return next();
  return res.status(getHttpStatusCode("NOT_FOUND")).send("not found");
};
