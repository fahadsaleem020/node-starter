import { Strategy, VerifyFunctionWithRequest } from "passport-local";
import { database } from "@/configs/connection.config";
import { users } from "@/schema/schema";
import { log } from "@/utils/logger";
import { compare } from "bcrypt";
import passport from "passport";

const verify: VerifyFunctionWithRequest = async (
  req,
  email,
  password,
  done
) => {
  try {
    const db = await database();
    const user = await db.query.users.findFirst({
      where: (t, { eq }) => eq(t.email, email),
    });

    if (!user) return done(null, false);

    const isPasswordMatched = await compare(password, user.password);
    if (!isPasswordMatched) return done(null, false);

    return done(null, user);
  } catch (error) {
    log.error(error);
    return done(error);
  }
};

export const initializePassportLocal = () => {
  passport.use(
    new Strategy({ usernameField: "email", passReqToCallback: true }, verify)
  );
  passport.serializeUser((user, done) => {
    return done(null, (user as typeof users.$inferSelect).id);
  });
  passport.deserializeUser(async (id, done) => {
    return done(
      null,
      await (
        await database()
      ).query.users.findFirst({
        where: (t, { eq }) => eq(t.id, id as string),
      })
    );
  });
};
