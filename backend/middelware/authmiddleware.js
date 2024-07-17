import { usermodel } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import errorHandler from "express-async-handler";

export const authmiddleware = errorHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await usermodel.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export const isAdmin = errorHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      if (!token) throw new Error("Not authorized, token failed");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await usermodel.findById(decoded.id).select("-password");
      if (req.user.role === "admin") {
        next();
      } else {
        res.status(401);
        throw new Error("Not authorized as an admin");
      }
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized as an admin");
    }
  }
});

export const IsAdminOrUser = errorHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await usermodel.findById(decoded.id).select("-password");
      if (req.user.role === "admin" || req.user._id == req.params.id) {
        next();
      } else {
        res.status(401);
        throw new Error("Not authorized as an admin");
      }
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized as an admin");
    }
  }
});
