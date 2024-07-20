import mongoose from "mongoose";

const BlogCategorySchema = new mongoose.Schema(
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

export const BlogCategorymodel = mongoose.model(
  "BlogCategory",
  BlogCategorySchema
);
