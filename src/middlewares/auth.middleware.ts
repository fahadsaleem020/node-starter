import { Request, Response, NextFunction } from "express";
import { getSession } from "@/utils/getsession.util";
import { logger } from "@/utils/logger.util";
import { status } from "http-status";

export const isAuthenticated = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const session = await getSession(req);

  if (session) {
    req.session = session;
    return next();
  }

  logger.error(status[status.UNAUTHORIZED]);
  throw new Error(status[status.UNAUTHORIZED]);
};

export const isUnAuthenticated = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const session = await getSession(req);

  if (!session) {
    return next();
  }

  logger.error(status[status.UNAUTHORIZED]);
  throw new Error(status[status.UNAUTHORIZED]);
};
