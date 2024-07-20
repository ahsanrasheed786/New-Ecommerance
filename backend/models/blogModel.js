// import { text } from "body-parser";
import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: { type: String, required: true },
    numViews: { type: Number, default: 0 },

    isLiked: Array,
    isDisLiked: Array,
    image: {
      type: String,
      required: true,
    },
    likes: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    DisLikes: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    images: [],
    author: {
      type: String,
      ref: "Admin",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

export const blogmodel = mongoose.model("Blog", blogSchema);
