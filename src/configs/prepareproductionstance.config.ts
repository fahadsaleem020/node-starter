import { SessionOptions } from "express-session";
import { Express } from "express";

interface Options {
  sessionOptions: SessionOptions;
  isProduction: boolean;
  app: Express;
}

export const prepareProductionStance = ({
  app,
  isProduction,
  sessionOptions,
}: Options) => {
  if (isProduction) {
    app.set("trust proxy", 1);
    sessionOptions.cookie!.secure = true;
    sessionOptions.cookie!.sameSite = "none";
    // sessionOptions.cookie!.sameSite = "strict";
    // sessionOptions.cookie!.domain = "*.beatfeedback.com";
  }
};
