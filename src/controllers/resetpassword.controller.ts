import { getHttpStatusCode, verifyCode } from "@/utils/auth";
import { NextFunction, Request, Response } from "express";
import { database } from "@/configs/connection.config";
import { users } from "@/schema/schema";
import { log } from "@/utils/logger";
import { eq } from "drizzle-orm";
import passport from "passport";
import { hash } from "bcrypt";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, password, confirmPassword, authenticate } = req.body as {
      confirmPassword: string;
      authenticate: string;
      password: string;
      code: string;
    };

    if (!(password === confirmPassword))
      return res
        .status(getHttpStatusCode("FORBIDDEN"))
        .send("Password doesn't match.");

    const { email } = await verifyCode(code);
    const hashedPassword = await hash(password, 10);
    const db = await database();
    const [isPasswordUpdate] = await db
      .update(users)
      .set({
        password: hashedPassword,
      })
      .where(eq(users.email, email));

    if (isPasswordUpdate.affectedRows && authenticate) {
      req.body = { email, password };
      passport.authenticate("local")(req, res, next);
    } else if (isPasswordUpdate.affectedRows && !authenticate) {
      next();
    } else {
      throw new Error("Failed to reset password");
    }
  } catch (e) {
    const error = e as Error;
    log.error(error);
    res.status(getHttpStatusCode("INTERNAL_SERVER_ERROR")).send(error.message);
  }
};
