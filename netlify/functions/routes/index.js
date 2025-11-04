import { Router } from "express";
import echo from "./echo.js";
import products from "./products.js";

const router = Router();

router.use(echo);
router.use(products);

export default router;
