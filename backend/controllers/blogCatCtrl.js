// import { Categorymodel } from "../models/productCategoryModel.js";
import { BlogCategorymodel } from "../models/blogCatModel.js";
import errorHandler from "express-async-handler";

export const createBlogCategory = errorHandler(async (req, res) => {
  try {
    const newCategory = await BlogCategorymodel.create(req.body);
    res.status(201).json({
      success: true,
      msg: "New Category Created",
      newCategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});

export const updateBlogCategory = errorHandler(async (req, res) => {
  const { id } = req.params;
  //   validateMongoDBId(id);
  try {
    const updateCategory = await BlogCategorymodel.findByIdAndUpdate(
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

export const deleteBlogCategory = errorHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteCategory = await BlogCategorymodel.findByIdAndDelete(id);
    if (!deleteCategory) throw new Error("Category not found");
    res.status(200).json(deleteCategory);
  } catch (error) {
    throw new Error(error);
  }
});

export const getSingleBlogCategory = errorHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const singleCategory = await BlogCategorymodel.findById(id);
    if (!singleCategory) throw new Error("Category not found");
    res.status(200).json(singleCategory);
  } catch (error) {
    throw new Error(error);
  }
});

export const getAllBlogCategory = errorHandler(async (req, res) => {
  try {
    const allCategory = await BlogCategorymodel.find();
    res.status(200).json(allCategory);
  } catch (error) {
    throw new Error(error);
  }
});
