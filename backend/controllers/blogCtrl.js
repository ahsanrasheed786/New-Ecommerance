import { blogmodel } from "../models/blogModel.js";
import errorHandler from "express-async-handler";
import { cloudinaryUploadImage } from "../utils/cloudnary.js";
import fs from "fs";
import { validateMongoDbId } from "../utils/ValidateMongoDbId.js";
import path from "path";
// import { usermodel } from "../models/userModel.js";

export const createBlog = errorHandler(async (req, res) => {
  try {
    const newBlog = await blogmodel.create(req.body);
    res.status(201).json({
      success: true,
      msg: "New Blog Created",
      newBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

export const updateBlog = errorHandler(async (req, res) => {
  const { id } = req.params;
  //   validateMongoDBId(id);
  const updateBlog = await blogmodel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!updateBlog) throw new Error("Blog not found");
  res.status(200).json(updateBlog);
});

export const singleBlog = errorHandler(async (req, res) => {
  const { blogId } = req.params;
  const user = req.user;
  try {
    const blog = await blogmodel.findById(blogId);
    if (!blog) throw new Error("Blog not found");
    await blog.updateOne({ $inc: { numViews: 1 } });
    // await blogmodel.findByIdAndUpdate(id, { $inc: { numViews: 1 } });
    // const userDisLiked=req.user.isDisLiked
    const alreadyLiked = user.likedBlog.some((id) => id == blogId);
    const alreadyDisLiked = user.disLikedBlog.some((id) => id == blogId);
    console.log(alreadyDisLiked);
    console.log(alreadyLiked);
    res.status(200).json({
      success: true,
      blog,
      liked: alreadyLiked,
      disLiked: alreadyDisLiked,
    });
  } catch (error) {
    throw new Error(error);
  }
});
export const allBlog = errorHandler(async (req, res) => {
  try {
    const blog = await blogmodel.find();
    res.status(200).json({
      success: true,
      blog,
      length: blog.length,
    });
  } catch (error) {
    throw new Error(error);
  }
});

export const deleteBlog = errorHandler(async (req, res) => {
  const { id } = req.params;
  //   validateMongoDBId(id);
  try {
    const deleteBlog = await blogmodel.findByIdAndDelete(id);
    if (!deleteBlog) throw new Error("Blog not found");
    res.status(200).json({
      success: true,
      msg: "Blog Deleted",
      deleteBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

export const likeBlog = errorHandler(async (req, res) => {
  const { blogId } = req.params;
  const userId = req.user._id.toString();
  try {
    const blog = await blogmodel.findById(blogId);
    // const blog = await blogmodel.findByIdAndUpdate(blogId);
    if (!blog) throw new Error("Blog not found");
    const alreadyLiked = blog.isLiked.some((id) => id == userId);
    if (alreadyLiked) {
      // ! removing blog liked id from user liked blog
      const index = blog.isLiked.indexOf(userId);
      if (index !== -1) {
        blog.isLiked.splice(index, 1);
      }
      // ! removing blogliked id in user object
      const user = req.user;
      const userIndex = user.likedBlog.indexOf(blogId);
      if (userIndex !== -1) {
        user.likedBlog.splice(index, 1);
      }
      await user.save();
      await blog.save();
      res.json({
        success: true,
        msg: "Blog UnLiked",
        blog,
      });
    } else {
      //   await blogmodel.findByIdAndUpdate(
      //     blogId,
      //     { $push: { isLiked: userId } },
      //     { new: true }
      //   );
      blog.isLiked.push(userId);
      // ! pushing blog liked id in user object
      const user = req.user;
      user.likedBlog.push(blogId);
      await user.save();
      await blog.save();
      res.json({
        success: true,
        msg: "Blog liked",
        user,
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});

export const disLikedBlog = errorHandler(async (req, res) => {
  const { blogId } = req.params;
  const userId = req.user._id.toString();
  try {
    const blog = await blogmodel.findById(blogId);
    // const blog = await blogmodel.findByIdAndUpdate(blogId);
    if (!blog) throw new Error("Blog not found");
    const alreadyLiked = blog.isDisLiked.some((id) => id == userId);
    if (alreadyLiked) {
      // ! removing blog liked id from user liked blog
      const index = blog.isDisLiked.indexOf(userId);
      if (index !== -1) {
        blog.isDisLiked.splice(index, 1);
      }
      // ! removing blogliked id in user object
      const user = req.user;
      const userIndex = user.disLikedBlog.indexOf(blogId);
      if (userIndex !== -1) {
        user.disLikedBlog.splice(index, 1);
      }
      await user.save();
      await blog.save();
      res.json({
        success: true,
        msg: "Blog UnDisliked",
        blog,
      });
    } else {
      //   await blogmodel.findByIdAndUpdate(
      //     blogId,
      //     { $push: { isLiked: userId } },
      //     { new: true }
      //   );
      blog.isDisLiked.push(userId);
      // ! pushing blog liked id in user object
      const user = req.user;
      user.disLikedBlog.push(blogId);
      await user.save();
      await blog.save();
      res.json({
        success: true,
        msg: "Blog Disliked",
        user,
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});
// ! uploading Images

// export const uploadImagesBlog = errorHandler(async (req, res) => {
//   console.log(req.files);
//   const { id } = req.params;
//   validateMongoDbId(id);
//   try {
//     const uploader = (path) => cloudinaryUploadImage(path, "images");
//     const urls = [];
//     const files = req.files;
//     for (const file of files) {
//       const { path } = file;
//       const newPath = await uploader(path);
//       console.log(newPath);
//       urls.push(newPath);
//       fs.unlinkSync(path);
//     }
//     const blog = await blogmodel.findByIdAndUpdate(
//       id,
//       {
//         images: urls.map((file) => file),
//       },
//       { new: true }
//     );
//     res.json(blog);
//   } catch (error) {
//     throw new Error(error);
//   }
// });

export const uploadImagesBlog = async (req, res) => {
  const { id } = req.params;
  // const filesWithUrlsAndPublicIds = req.uploadedFiles;
  validateMongoDbId(id);

  try {
    const uploader = (path) => cloudinaryUploadImage(path, "images");
    const urls = [];
    const files = req.files;
    // console.log(path);
    for (const file of files) {
      const { path } = file;

      const newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }

    const blog = await blogmodel.findById(id);
    const images = blog.images;
    const OldAndNewImages = [...images, ...urls];
    const updated = await blogmodel.findByIdAndUpdate(
      id,
      {
        images: OldAndNewImages,
      },

      // {
      //   // urls.map((file) => file),

      //   $push: {
      //     // urls.map((file) => file),
      //     images: urls.map((file) => file),
      //   },
      // },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
