// import { uploadOnCloudinary } from "../utils/cloudnary.js";

// export const uploadCloud = async (req, res, next) => {
//   const files = req.files;
//   if (!files || files.length === 0) {
//     return res
//       .status(400)
//       .json({ success: false, error: "No files were uploaded." });
//   }

//   try {
//     const uploadFilesPromises = files.map((file) => uploadOnCloudinary(file));

//     const uploadResults = await Promise.all(uploadFilesPromises);

//     const uploadFilesUrlsAndPublicIds = uploadResults.map((result) => ({
//       url: result.secure_url,
//       public_id: result.public_id,
//     }));

//     req.uploadedFiles = uploadFilesUrlsAndPublicIds;

//     next();
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ success: false, error: "Error uploading files." });
//   }
// };
