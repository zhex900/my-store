import { Router } from "express";

const router = Router();

router.post("/echo", (req, res) => {
  res.json({ youSent: req.body || null });
});

router.get("/hello", (req, res) => {
  res.json({ message: "Hello from Netlify Functions + Express (hello)" });
});

export default router;
