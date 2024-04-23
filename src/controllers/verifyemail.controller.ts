import { verifyCode, getHttpStatusCode } from "@/utils/auth";
import { NextFunction, Request, Response } from "express";
import { database } from "@/configs/connection.config";
import { users } from "@/schema/schema";
import { log } from "@/utils/logger";
import passport from "passport";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const code: string = req.method === "GET" ? req.params.code : req.body.code;
    const shouldAuthenticate = req.body.authenticate;

    const { email, password, fullName, userRoles, profilePic } =
      await verifyCode(code);

    // !add necessary fields on user creation
    const db = await database();
    const [isUserInserted] = await db.insert(users).values({
      email,
      fullName,
      password,
      userRoles,
      profilePic,
    });

    if (isUserInserted.affectedRows && shouldAuthenticate) {
      req.body = { email, password };
      passport.authenticate("local")(req, res, next);
    } else if (isUserInserted.affectedRows) {
      next();
    } else {
      return res
        .status(getHttpStatusCode("INTERNAL_SERVER_ERROR"))
        .send("Failed to create user");
    }
  } catch (error) {
    log.error(error);
    res.status(getHttpStatusCode("NOT_ACCEPTABLE")).send("code expired");
  }
};
