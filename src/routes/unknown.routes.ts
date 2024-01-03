import { getHttpStatusCode } from "@/utils/auth";
import { Router } from "express";
const routes = Router();

routes.use((req, res) => {
  res.status(getHttpStatusCode("NOT_FOUND")).send("Not found");
});

export default routes;
