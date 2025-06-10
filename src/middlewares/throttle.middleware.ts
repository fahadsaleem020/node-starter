import { type IRateLimiterStoreNoAutoExpiryOptions } from "rate-limiter-flexible";
import { RateLimiterMySQL, RateLimiterMemory } from "rate-limiter-flexible";
import { connection, database } from "../configs/connection.config";
import { throttleinsight } from "@/schema/schema";
import type { RequestHandler } from "express";
import { status } from "http-status";

interface IOverRideOptions
  extends Omit<IRateLimiterStoreNoAutoExpiryOptions, "storeClient"> {
  errorMessage?: string;
}

const options: IRateLimiterStoreNoAutoExpiryOptions = {
  dbName: process.env.database,
  storeClient: connection,
  tableName: "throttle",
  blockDuration: 10,
  keyPrefix: "",
  duration: 1,
  points: 20,
};

type Throttle = <O = IOverRideOptions | "default">(
  overRideOptions: O
) => RequestHandler;

export const throttle: Throttle = (overRideOptions) => {
  const limiter = new RateLimiterMySQL({
    ...options,
    ...(overRideOptions === "default"
      ? {}
      : {
          ...overRideOptions,
          insuranceLimiter: new RateLimiterMemory({
            blockDuration: (overRideOptions as IOverRideOptions).blockDuration,
            keyPrefix: (overRideOptions as IOverRideOptions).keyPrefix,
            duration: (overRideOptions as IOverRideOptions).duration,
            points: (overRideOptions as IOverRideOptions).points,
          }),
        }),
  });

  return async (req, res, next) => {
    try {
      await limiter.consume(req.ip!);
      next();
    } catch (error) {
      const db = await database();
      const afterConsumption = await limiter.get(req.ip!);

      if (afterConsumption) {
        const {
          msBeforeNext,
          consumedPoints,
          remainingPoints,
          isFirstInDuration,
        } = afterConsumption;

        const values = {
          msBeforeNext,
          consumedPoints,
          remainingPoints,
          isFirstInDuration,
          endPoint: req.path,
          waitTime: msBeforeNext / 1000,
        };

        await db
          .insert(throttleinsight)
          .values({
            key: req.ip!,
            pointsAllotted: limiter.duration,
            ...values,
          })
          .onConflictDoUpdate({
            target: throttleinsight.key,
            set: values,
          });
      }

      const customErrorMessage =
        overRideOptions &&
        typeof overRideOptions === "object" &&
        "errorMessage" in overRideOptions
          ? (overRideOptions?.errorMessage as string)
          : undefined;

      res
        .status(status.TOO_MANY_REQUESTS)
        .json({ message: customErrorMessage ?? "Too many requests" });
    }
  };
};
