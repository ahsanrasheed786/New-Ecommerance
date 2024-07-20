import express from "express";
import { authmiddleware, isAdmin } from "../middelware/authmiddleware.js";
import {
  createProduct,
  findAllProduct,
  findSingleProduct,
  updateProduct,
  deleteProduct,
  addToWishList,
  addReview,
  uploadImages,
} from "../controllers/productCtrl.js";
import { uploadPhoto, productImageResize } from "../middelware/uploadImages.js";
// import multiUpload from "../middelware/multer.js";
// import { uploadCloud } from "../middelware/uploadCloud.js";
// import multer from "../middelware/multer.js";

const router = express.Router();

router.post("/create", authmiddleware, isAdmin, createProduct);
router.get("/all", authmiddleware, isAdmin, findAllProduct);
router.get("/single/:id", authmiddleware, isAdmin, findSingleProduct);
router.patch("/update/:id", authmiddleware, isAdmin, updateProduct);
router.delete("/delete/:id", authmiddleware, isAdmin, deleteProduct);
router.put("/addtowishlist", authmiddleware, addToWishList);
router.put("/addreview", authmiddleware, addReview);
// ! Upload Image
router.put(
  "/upload/:id",
  uploadPhoto.array("images", 10),
  // multer,
  productImageResize,
  // multiUpload,
  // uploadCloud,
  uploadImages
);
export default router;
