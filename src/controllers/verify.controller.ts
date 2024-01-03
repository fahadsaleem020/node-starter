import { verifyCode, getHttpStatusCode } from "@/utils/auth";
import { database } from "@/configs/connection.config";
import { Request, Response } from "express";
import { users } from "@/schema/schema";

export default async (req: Request, res: Response) => {
  try {
    // add necessary fields on user creation
    const { email, password, fullName, profilePic, userRoles } =
      await verifyCode(
        req[req.method === "GET" ? "params" : "body"].code as string
      );

    const db = await database();
    const [affectedRows] = await db.insert(users).values({
      email,
      fullName,
      password,
      userRoles,
      profilePic,
    });

    if (affectedRows) {
      res.send("verifified");
    }
  } catch (error) {
    console.log(error);
    res.status(getHttpStatusCode("NOT_ACCEPTABLE")).send("session expired");
  }
};
