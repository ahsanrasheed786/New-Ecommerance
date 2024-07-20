// import { Categorymodel } from "../models/productCategoryModel.js";
import errorHandler from "express-async-handler";
import { BrandCategorymodel } from "../models/brandCatModel.js";

export const createBrandCategory = errorHandler(async (req, res) => {
  try {
    const newCategory = await BrandCategorymodel.create(req.body);
    res.status(201).json({
      success: true,
      msg: "New Category Created",
      newCategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});

export const updateBrandCategory = errorHandler(async (req, res) => {
  const { id } = req.params;
  //   validateMongoDBId(id);
  try {
    const updateCategory = await BrandCategorymodel.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );
    if (!updateCategory) throw new Error("Category not found");
    res.status(200).json(updateCategory);
  } catch (error) {
    throw new Error(error);
  }
});

export const deleteBrandCategory = errorHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteCategory = await BrandCategorymodel.findByIdAndDelete(id);
    if (!deleteCategory) throw new Error("Category not found");
    res.status(200).json(deleteCategory);
  } catch (error) {
    throw new Error(error);
  }
});

export const getSingleBrandCategory = errorHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const singleCategory = await BrandCategorymodel.findById(id);
    if (!singleCategory) throw new Error("Category not found");
    res.status(200).json(singleCategory);
  } catch (error) {
    throw new Error(error);
  }
});

export const getAllBrandCategory = errorHandler(async (req, res) => {
  try {
    const allCategory = await BrandCategorymodel.find();
    res.status(200).json(allCategory);
  } catch (error) {
    throw new Error(error);
  }
});
