import { Request, Router } from "express";
const routes = Router();

routes.get("/", async (req: Request, res) => {
  res.end("This is an example route");
});

export default routes;
