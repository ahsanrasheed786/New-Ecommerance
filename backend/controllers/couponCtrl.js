import { CouponModel } from "../models/couponModel.js";
import errorHandler from "express-async-handler";
// import mongodbIdHandler

export const createCoupon = errorHandler(async (req, res) => {
  try {
    const newCoupon = await CouponModel.create(req.body);
    res.status(201).json({
      success: true,
      msg: "New Coupon Created",
      newCoupon,
    });
  } catch (error) {
    throw new Error(error);
  }
});

export const updateCoupon = errorHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const updateCoupon = await CouponModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updateCoupon) throw new Error("Coupon not found");
    res.status(200).json(updateCoupon);
  } catch (error) {
    throw new Error(error);
  }
});

export const deleteCoupon = errorHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteCoupon = await CouponModel.findByIdAndDelete(id);
    if (!deleteCoupon) throw new Error("Coupon not found");
    res.status(200).json(deleteCoupon);
  } catch (error) {
    throw new Error(error);
  }
});

export const getCoupon = errorHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const getCoupon = await CouponModel.findById(id);
    if (!getCoupon) throw new Error("Coupon not found");
    res.status(200).json(getCoupon);
  } catch (error) {
    throw new Error(error);
  }
});

export const getAllCoupon = errorHandler(async (req, res) => {
  try {
    const getAllCoupon = await CouponModel.find();
    res.status(200).json(getAllCoupon);
  } catch (error) {
    throw new Error(error);
  }
});
