import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getSingleCategory,
  updateCategory,
} from "../controllers/productCategoryCtrl.js";
const router = express.Router();

router.post("/", createCategory);
router.patch("/:id", updateCategory);
router.delete("/:id", deleteCategory);
router.get("/:id", getSingleCategory);
router.get("/", getAllCategory);

export default router;
