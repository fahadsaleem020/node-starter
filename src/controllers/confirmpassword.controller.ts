import { getHttpStatusCode, verifyCode } from "@/utils/auth";
import { database } from "@/configs/connection.config";
import { Request, Response } from "express";
import { users } from "@/schema/schema";
import { log } from "@/utils/logger";
import { eq } from "drizzle-orm";
import { hash } from "bcrypt";

export default async (req: Request, res: Response) => {
  try {
    const { code, password, confirmPassword } = req.body as {
      code: string;
      password: string;
      confirmPassword: string;
    };

    if (!(password === confirmPassword))
      return res
        .status(getHttpStatusCode("FORBIDDEN"))
        .send("Password doesn't match.");

    const { email } = await verifyCode(code);
    const hashedPassword = await hash(password, 10);

    const db = await database();
    const [isUserUpdated] = await db
      .update(users)
      .set({
        password: hashedPassword,
      })
      .where(eq(users.email, email));

    if (isUserUpdated.affectedRows)
      return res.send(
        "Password reset successful. Log in with your new password."
      );

    throw new Error("something went wrong.");
  } catch (error) {
    log.error(error);
    res.status(getHttpStatusCode("INTERNAL_SERVER_ERROR")).send(error);
  }
};
