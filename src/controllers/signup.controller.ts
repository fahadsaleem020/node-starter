import { database } from "@/configs/connection.config";
import { users, verification } from "@/schema/schema";
import { getHttpStatusCode } from "@/utils/auth";
import { generateJwt } from "@/utils/common";
import { Request, Response } from "express";
import { hash } from "bcrypt";

export default async (req: Request, res: Response) => {
  try {
    // ! MUST VALIDATE BEFORE INSERTION
    const user = {
      email: req.body.email as string,
      password: await hash(req.body.password, 10),
      fullName: req.body.fullName as string,
      profilePic: req.body.profilePic as string,
    } as typeof users.$inferSelect;

    const db = await database();
    const isUserExists = await db.query.users.findFirst({
      where: (t, { eq }) => eq(t.email, user.email),
    });

    if (isUserExists)
      return res
        .status(getHttpStatusCode("FORBIDDEN"))
        .end("email already exists(ambigious message)");

    const token = generateJwt(user);

    const [isVerification] = await db
      .insert(verification)
      .values({
        email: user.email,
        token: token,
      })
      .onDuplicateKeyUpdate({
        set: {
          token: token,
        },
      });

    if (isVerification.affectedRows) {
      const verificationTable = await db.query.verification.findFirst({
        where: (t, { eq }) => eq(t.email, user.email),
      });

      // send via email (sendgrid).
      if (verificationTable) return res.json({ code: verificationTable.id });

      //Exception on verification data empty
      throw new Error("something went wrong.");
    }
    //Exception on verification upsert failure.
    throw new Error("something went wrong.");
  } catch (error) {
    console.log(error);
    res.status(getHttpStatusCode("INTERNAL_SERVER_ERROR")).send(error);
  }
};
