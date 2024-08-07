import express from "express";
import {
  authmiddleware,
  isAdmin,
  IsAdminOrUser,
} from "../middelware/authmiddleware.js";
const router = express.Router();
import {
  blockAndUnblock,
  createUser,
  deleteUser,
  findAllUser,
  findSingleUser,
  forgetPassword,
  handelRefreshToken,
  logOutHander,
  resetPassword,
  updatePassword,
  updateUser,
  userLogIn,
} from "../controllers/userCtrl.js";

router.post("/register", createUser);
router.post("/login", userLogIn);
router.get("/all-users", findAllUser);
router.get("/:id", authmiddleware, findSingleUser);
router.patch("/update-user/:id", IsAdminOrUser, updateUser);
router.delete("/delete-user/:id", IsAdminOrUser, deleteUser);
router.patch("/block-user/:id", isAdmin, blockAndUnblock);
router.post("/refresh", handelRefreshToken);
router.post("/logout", logOutHander);
router.put("/update-password", authmiddleware, updatePassword);
router.put("/update-password", authmiddleware, updatePassword);
router.post("/forget-password-token", forgetPassword);
router.put("/reset-password/:token", resetPassword);
export default router;
