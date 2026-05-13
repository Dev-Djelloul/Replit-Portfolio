import { Router, type IRouter } from "express";
import healthRouter from "./health";
import notionRouter from "./notion";
import contactRouter from "./contact";

const router: IRouter = Router();

router.use(healthRouter);
router.use(notionRouter);
router.use(contactRouter);

export default router;
