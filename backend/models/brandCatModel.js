import mongoose from "mongoose";

const BrandCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  { timestamp: true }
);

export const BrandCategorymodel = mongoose.model(
  "BrandCategory",
  BrandCategorySchema
);
