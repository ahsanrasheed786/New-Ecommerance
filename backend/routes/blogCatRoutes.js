import express from "express";
import {
  createBlogCategory,
  deleteBlogCategory,
  getAllBlogCategory,
  getSingleBlogCategory,
  updateBlogCategory,
} from "../controllers/blogCatCtrl.js";

const router = express.Router();

router.post("/", createBlogCategory);
router.patch("/:id", updateBlogCategory);
router.delete("/:id", deleteBlogCategory);
router.get("/:id", getSingleBlogCategory);
router.get("/", getAllBlogCategory);

export default router;
