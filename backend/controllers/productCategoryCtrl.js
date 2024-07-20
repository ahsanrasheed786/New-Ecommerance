import { Categorymodel } from "../models/productCategoryModel.js";
import errorHandler from "express-async-handler";

export const createCategory = errorHandler(async (req, res) => {
  try {
    const newCategory = await Categorymodel.create(req.body);
    res.status(201).json({
      success: true,
      msg: "New Category Created",
      newCategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});

export const updateCategory = errorHandler(async (req, res) => {
  const { id } = req.params;
  //   validateMongoDBId(id);
  try {
    const updateCategory = await Categorymodel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updateCategory) throw new Error("Category not found");
    res.status(200).json(updateCategory);
  } catch (error) {
    throw new Error(error);
  }
});

export const deleteCategory = errorHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteCategory = await Categorymodel.findByIdAndDelete(id);
    if (!deleteCategory) throw new Error("Category not found");
    res.status(200).json(deleteCategory);
  } catch (error) {
    throw new Error(error);
  }
});

export const getSingleCategory = errorHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const singleCategory = await Categorymodel.findById(id);
    if (!singleCategory) throw new Error("Category not found");
    res.status(200).json(singleCategory);
  } catch (error) {
    throw new Error(error);
  }
});

export const getAllCategory = errorHandler(async (req, res) => {
  try {
    const allCategory = await Categorymodel.find();
    res.status(200).json(allCategory);
  } catch (error) {
    throw new Error(error);
  }
});
