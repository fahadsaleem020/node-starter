import { getHttpStatusCode } from "@/utils/auth";
import { Request, Response } from "express";

export const logoutController = (req: Request, res: Response) => {
  req.logout((error) => {
    if (error)
      return res
        .status(getHttpStatusCode("NOT_FOUND"))
        .send("failed to logout");
  });

  res.send("logged out");
};
