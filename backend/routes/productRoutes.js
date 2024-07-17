import express from "express";
import {
  authmiddleware,
  isAdmin,
  IsAdminOrUser,
} from "../middelware/authmiddleware.js";
import {
  createProduct,
  findAllProduct,
  findSingleProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productCtrl.js";

const router = express.Router();

router.post("/create", authmiddleware, isAdmin, createProduct);
router.get("/all", authmiddleware, isAdmin, findAllProduct);
router.get("/single/:id", authmiddleware, isAdmin, findSingleProduct);
router.patch("/update/:id", authmiddleware, isAdmin, updateProduct);
router.delete("/delete/:id", authmiddleware, isAdmin, deleteProduct);

export default router;
