import express from "express";
import {
  createBrandCategory,
  deleteBrandCategory,
  getAllBrandCategory,
  getSingleBrandCategory,
  updateBrandCategory,
} from "../controllers/brandCatCtrl.js";
const router = express.Router();

router.post("/", createBrandCategory);
router.patch("/:id", updateBrandCategory);
router.delete("/:id", deleteBrandCategory);
router.get("/:id", getSingleBrandCategory);
router.get("/", getAllBrandCategory);

export default router;
