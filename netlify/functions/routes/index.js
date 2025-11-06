import { Router } from "express";
import echo from "./echo.js";
import products from "./products.js";
import checkout from "./checkout.js";

const router = Router();

router.use(echo);
router.use(products);
router.use(checkout);

export default router;
