import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
      //   select: false,
    },
    images: {
      type: Array,
      required: true,
    },
    color: {
      type: String,
      enum: ["Black", "Brown", "Red"],
    },
    ratings: [
      {
        stars: Number,
        comment: String,
        postedBy: String,
      },
    ],
    totalRatings: {
      type: Number,
      default: 0,
    },
    brand: {
      type: String,
      required: true,
    },
    isFeatured: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const productmodel = mongoose.model("Product", productSchema);
