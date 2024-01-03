import { Request, Response } from "express";
import { users } from "@/schema/schema";

export const userController = async (req: Request, res: Response) => {
  const { id, createdAt, updatedAt, password, ...rest } =
    req.user as typeof users.$inferSelect;

  res.json(rest);
};
