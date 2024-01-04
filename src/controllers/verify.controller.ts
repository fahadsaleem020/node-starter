import { verifyCode, getHttpStatusCode } from "@/utils/auth";
import { database } from "@/configs/connection.config";
import { Request, Response } from "express";
import { users } from "@/schema/schema";
import { log } from "@/utils/logger";

export default async (req: Request, res: Response) => {
  try {
    const { email, password, fullName, profilePic, userRoles } =
      await verifyCode(
        req[req.method === "GET" ? "params" : "body"].code as string
      );

    // !add necessary fields on user creation
    const db = await database();
    const [iserUserInserted] = await db.insert(users).values({
      email,
      fullName,
      password,
      userRoles,
      profilePic,
    });

    if (iserUserInserted.affectedRows) {
      // !return user fields (email and password(unhashed)) incase you want to sign in after verification
      res.send("verifified");
    }
  } catch (error) {
    log.error(error);
    res.status(getHttpStatusCode("NOT_ACCEPTABLE")).send("session expired");
  }
};
