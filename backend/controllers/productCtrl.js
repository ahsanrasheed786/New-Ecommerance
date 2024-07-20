import errorHandler from "express-async-handler";
import { productmodel } from "../models/productModel.js";
import slugify from "slugify";
import { usermodel } from "../models/userModel.js";
// import { cloudinaryUpload } from "../utils/cloudnary.js";
import { cloudinaryUploadImage } from "../utils/cloudnary.js";
import fs from "fs";
import { validateMongoDbId } from "../utils/ValidateMongoDbId.js";

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

export const addToWishList = errorHandler(async (req, res) => {
  const { id } = req.user;
  const { productId } = req.body;
  try {
    const user = await usermodel.findById(id);
    if (!user) throw new Error("Please Login First");
    const alreadyAdded = user.wishlist.find((id) => id == productId);
    if (alreadyAdded) {
      //! removing product from wishlist
      let user = await usermodel.findByIdAndUpdate(
        id,
        {
          $pull: { wishlist: productId },
        },
        { new: true }
      );
      res.json({
        success: true,
        msg: "Product Removed from wishlist",
        // user,
      });
    } else {
      //! adding product to wishlist
      let user = await usermodel.findByIdAndUpdate(
        id,
        {
          $push: { wishlist: productId },
        },
        { new: true }
      );
      res.json({
        success: true,
        msg: "Product Added to wishlist",
        // user,
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});

//! making a function for counting the reviews of a product and then
//! i will call it when any user add or updata the review

const ratingCount = errorHandler(async (rating, productId) => {
  try {
    const length = rating.length;
    const sum = rating.reduce((acc, curr) => acc + curr.stars, 0);
    const avg = sum / length;
    const star = Math.round(avg);
    const product = await productmodel.findByIdAndUpdate(productId, {
      totalRatings: star,
    });
  } catch (error) {
    throw new Error(error);
  }
});
export const addReview = errorHandler(async (req, res) => {
  const { id } = req.user;
  const { stars, comment, productId } = req.body;
  try {
    const product = await productmodel.findById(productId);
    if (!product) throw new Error("Product Not Found");
    let alreadyRated = product.ratings.find((x) => x.postedBy == id);
    if (alreadyRated) {
      await productmodel.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.stars": stars, "ratings.$.comment": comment },
        },
        { new: true }
      );
      //! here i am calling functtion which is counting the rating of a product
      ratingCount(product.ratings, productId);
      res.json({ success: true, msg: "Rating Updated" });
    } else {
      console.log(id);
      const newRating = await productmodel.findByIdAndUpdate(
        productId,
        {
          $push: { ratings: { stars, comment, postedBy: id } },
        },
        { new: true }
      );
      //! here i am calling functtion which is counting the rating of a product
      ratingCount(product.ratings, productId);
      res.json({ success: true, msg: "Rating Added", newRating });
    }
  } catch (error) {
    throw new Error(error);
  }
});

// export const uploadImages = async (req, res) => {
//   const { id } = req.params;
//   // const filesWithUrlsAndPublicIds = req.uploadedFiles;
//   validateMongoDbId(id);

//   try {
//     const uploader = (path) => cloudinaryUploadImage(path, "images");
//     const urls = [];
//     const files = req.files;

//     for (const file of files) {
//       const { path } = file;
//       const newPath = await uploader(path);
//       urls.push(newPath);
//       fs.unlinkSync(path);
//     }

//     const product = await productmodel.findById(id);
//     const images = product.images;
//     const OldAndNewImages = [...images, ...urls];
//     const updated = await productmodel.findByIdAndUpdate(
//       id,
//       {
//         images: OldAndNewImages,
//       },
//       { new: true }
//     );
//     res.json(updated);
//   } catch (error) {
//     res.status(500).json({ message: error.message, success: false, product });
//   }
// };

export const uploadImages = async (req, res) => {
  const { id } = req.params;
  // const filesWithUrlsAndPublicIds = req.uploadedFiles;
  validateMongoDbId(id);

  try {
    const uploader = (path) => cloudinaryUploadImage(path, "images");
    const urls = [];
    const files = req.files;

    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }

    const product = await productmodel.findById(id);
    const images = product.images;
    const OldAndNewImages = [...images, ...urls];
    const updated = await productmodel.findByIdAndUpdate(
      id,
      {
        images: OldAndNewImages,
      },
      { new: true }
    );
    res.json({ success: true, msg: "Images uploaded", updated });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
