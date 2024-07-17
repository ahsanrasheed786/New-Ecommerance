import errorHandler from "express-async-handler";
import { productmodel } from "../models/productModel.js";
import slugify from "slugify";
//by using the package "slugify" we are able to create a unique slug (-) for our product
export const createProduct = errorHandler(async (req, res) => {
  try {
    // if (!req.body.title) req.body.slug = slugify(req.body.title);
    if (req.body.title) req.body.slug = slugify(req.body.title);
    const newProduct = await productmodel.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

export const findAllProduct = errorHandler(async (req, res) => {
  try {
    // ! filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(queryStr));
    let query = productmodel.find(JSON.parse(queryStr));
    //! sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }
    //! field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }
    //! pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    const productCount = await productmodel.countDocuments();
    if (skip >= productCount) throw new Error("This Page Dosent Exist");
    // res.json({productCount,page,limit});

    const product = await query;
    // let query = productmodel.find(JSON.parse(queryStr));
    // const allProduct = await productmodel.find(
    //first way to filter direct query value from datebase i will use 2nd way the
    // third way is use the "whare" as the place of find
    // req.query
    //   {
    // brand: req.query.brand,
    // category: req.query.category,
    // color: req.query.color,
    //   }
    //   queryObj
    // );
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});

export const findSingleProduct = errorHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const singleProduct = await productmodel.findById(id);
    if (!singleProduct) throw new Error("Product Not Found");
    res.json(singleProduct);
  } catch (error) {
    throw new Error(error);
  }
});

export const updateProduct = errorHandler(async (req, res) => {
  const { id } = req.params;
  try {
    // if (req.body.slug) req.body.slug = slugify(req.body.title);
    const updateProduct = await productmodel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updateProduct) throw new Error("Product Not Found");
    res.json(updateProduct);
  } catch (error) {
    throw new Error(error);
  }
});

export const deleteProduct = errorHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteProduct = await productmodel.findByIdAndDelete(id);
    if (!deleteProduct) throw new Error("Product Not Found");
    res.json(deleteProduct);
  } catch (error) {
    throw new Error(error);
  }
});
