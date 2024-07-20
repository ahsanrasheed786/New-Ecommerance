import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
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

export const Categorymodel = mongoose.model("Category", categorySchema);
