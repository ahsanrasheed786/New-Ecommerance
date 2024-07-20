import express from "express";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupon,
  getCoupon,
  updateCoupon,
} from "../controllers/couponCtrl.js";
import { authmiddleware, isAdmin } from "../middelware/authmiddleware.js";

const router = express.Router();

router.post("/create", createCoupon);
router.get("/getall", getAllCoupon);
router.patch("/update/:id", authmiddleware, isAdmin, updateCoupon);
router.delete("/delete/:id", authmiddleware, isAdmin, deleteCoupon);
router.get("/get/:id", authmiddleware, isAdmin, getCoupon);

export default router;
