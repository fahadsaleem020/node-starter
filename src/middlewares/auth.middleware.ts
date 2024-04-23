import { Response, NextFunction } from "express";
import { getHttpStatusCode } from "@/utils/auth";
import DeviceDetector from "device-detector-js";
import { Request } from "express";

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

export const insertDevice = (req: Request, _: Response, next: NextFunction) => {
  const deviceDetector = new DeviceDetector();
  const device = deviceDetector.parse(req.headers["user-agent"]!);
  (req.session as any).device = device;

  next();
};
