import { Ratelimit, type Duration } from "@upstash/ratelimit";
import type { RequestHandler } from "express";
import { Redis } from "@upstash/redis";
import { status } from "http-status";
import { config } from "dotenv";
config();

const redis = Redis.fromEnv();

export const throttle = (
  points: number,
  duration: Duration
): RequestHandler => {
  const ratelimit = new Ratelimit({
    limiter: Ratelimit.slidingWindow(points, duration),
    prefix: "",
    redis,
  });

  return async (req, res, next) => {
    try {
      const { success } = await ratelimit.limit(req.ip!);
      if (!success) {
        return res
          .status(status.TOO_MANY_REQUESTS)
          .json({ message: "Too many requests" });
      }
      next();
    } catch (error) {
      console.error("Rate limiter error:", error);
      res
        .status(status.INTERNAL_SERVER_ERROR)
        .json({ message: "Rate limiter failed" });
    }
  };
};
