import express from "express";
import {
  allBlog,
  createBlog,
  deleteBlog,
  disLikedBlog,
  likeBlog,
  singleBlog,
  updateBlog,
  uploadImagesBlog,
} from "../controllers/blogCtrl.js";
import { authmiddleware, isAdmin } from "../middelware/authmiddleware.js";
import { blogImageResize, uploadPhoto } from "../middelware/uploadImages.js";
// import { uploadImages } from "../controllers/productCtrl.js";
const router = express.Router();

router.post("/new", authmiddleware, isAdmin, createBlog);
router.patch("/update/:id", authmiddleware, isAdmin, updateBlog);
router.get("/:blogId", authmiddleware, isAdmin, singleBlog);
router.get("/", authmiddleware, isAdmin, allBlog);
router.delete("/delete/:id", authmiddleware, isAdmin, deleteBlog);
router.post("/like/:blogId", authmiddleware, likeBlog);
router.post("/dislike/:blogId", authmiddleware, disLikedBlog);
router.put(
  "/upload/:id",
  // authmiddleware,
  // isAdmin,
  uploadPhoto.array("images", 10),
  blogImageResize,
  // uploadImages
  uploadImagesBlog
);

export default router;
