import { database } from "@/configs/connection.config";
import { users, verification } from "@/schema/schema";
import { getHttpStatusCode } from "@/utils/auth";
import { generateJwt } from "@/utils/common";
import { Request, Response } from "express";
import { log } from "@/utils/logger";

export default async (req: Request, res: Response) => {
  try {
    const { email } = req.body as typeof users.$inferSelect;

    const db = await database();
    const user = await db.query.users.findFirst({
      where: (t, { eq }) => eq(t.email, email),
    });

    if (!user) throw new Error("Email doesn't exists in our system.");

    // !put any additional fields into token to safely extract on code password confirmation
    const token = generateJwt({ email });

    const [isVerification] = await db
      .insert(verification)
      .values({
        email,
        token,
      })
      .onDuplicateKeyUpdate({
        set: {
          token,
        },
      });

    if (isVerification.affectedRows) {
      const verificationTable = await db.query.verification.findFirst({
        where: (t, { eq }) => eq(t.email, email),
      });

      // send via email (sendgrid).
      if (verificationTable) return res.json({ code: verificationTable.id });
    }

    throw new Error("something went wrong.");
  } catch (e) {
    const error = e as Error;
    log.error(error);
    res.status(getHttpStatusCode("BAD_REQUEST")).send(error.message);
  }
};
