import { Router, type IRouter } from "express";
import healthRouter from "./health";
import notionRouter from "./notion";
import contactRouter from "./contact";
import storageRouter from "./storage";
import mediaRouter from "./media";

const router: IRouter = Router();

router.use(healthRouter);
router.use(notionRouter);
router.use(contactRouter);
router.use(storageRouter);
router.use(mediaRouter);

export default router;
