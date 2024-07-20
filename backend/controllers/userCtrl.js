import { usermodel } from "../models/userModel.js";
import errorHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { generateToken } from "../config/jwt.js";
import { generateRefeshToken } from "../config/refreshToken.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "./emailCtrl.js";
export const createUser = errorHandler(async (req, res, next) => {
  const { firstname, lastname, email, phone, password } = req.body;
  const findUser = await usermodel.findOne({ email: email });
  try {
    if (!findUser) {
      //create new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await usermodel.create({
        firstname,
        lastname,
        email,
        phone,
        password: hashedPassword,
      });
      const token = generateToken(newUser._id);

      res.status(201).json({
        success: true,
        msg: "New User Created",
        newUser,
        token,
      });
    } else {
      //user already existfindUser
      throw new Error("User Alread exits");
    }
  } catch (error) {
    throw new Error(error);
  }
});

export const userLogIn = errorHandler(async (req, res) => {
  const { email, phone, password } = req.body;

  const findUser = await usermodel.findOne({ email: email });

  try {
    if (findUser) {
      const compair = await bcrypt.compare(password, findUser.password);
      const refreshToken = await generateRefeshToken(findUser._id);
      const updateUser = await usermodel.findByIdAndUpdate(
        findUser._id,
        { refreshToken },
        { new: true }
      );
      res.cookie("RefreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });
      const token = generateToken(findUser._id);
      if (compair) {
        res.status(201).json({
          success: true,
          msg: "User Logged in",
          user: findUser,
          token,
        });
      } else {
        throw new Error("Wrong password");
      }
    }
  } catch (error) {
    throw new Error(error);
  }
});

export const findAllUser = errorHandler(async (req, res) => {
  const allUser = await usermodel.find();
  try {
    res.json(allUser);
  } catch (error) {
    throw new Error(error);
  }
});
export const findSingleUser = errorHandler(async (req, res) => {
  const { id } = req.params;
  const singleUser = await usermodel.findById(id);
  if (!singleUser) throw new Error("User not found");

  try {
    res.json(singleUser);
  } catch (error) {
    throw new Error("error");
  }
});

export const updateUser = errorHandler(async (req, res) => {
  const { id } = req.user;
  const { firstname, lastname, email, phone, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const updateuser = await usermodel.findByIdAndUpdate(
    id,
    {
      firstname,
      lastname,
      email,
      phone,
      password: hashedPassword,
    },
    { new: true }
  );
  if (!updateuser) throw new Error("User not found");
  try {
    res.json(updateuser);
  } catch (error) {
    throw new Error(error);
  }
});

export const deleteUser = errorHandler(async (req, res) => {
  const { id } = req.params;
  const deleteuser = await usermodel.findByIdAndDelete(id);
  try {
    if (!deleteuser) throw new Error("User not found");
    res.json(deleteuser);
  } catch (error) {
    throw new Error(error);
  }
});

export const blockAndUnblock = errorHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const user = await usermodel.findById(id);
    if (!user) throw new Error("User Not Found");

    const UpdatingUser = await usermodel.findByIdAndUpdate(id, {
      isBlocked: user.isBlocked === false ? true : false,
    });
    res.json({
      success: true,
      msg:
        UpdatingUser.isBlocked == true
          ? "User is Blocked Now"
          : "User is Unblocked Now",
      UpdatingUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

export const handelRefreshToken = errorHandler(async (req, res) => {
  const cookie = req.cookies;
  try {
    if (!cookie.RefreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.RefreshToken;
    const decodeToken = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const userId = decodeToken.id;
    const user = await usermodel.findById(userId);
    if (!user) throw new Error("User No User Found");
    const varification = refreshToken == user.refreshToken;
    if (!varification) throw new Error("Refresh Token Varification Failed");
    //now gernating a token
    const token = generateToken(user._id);
    res.json({
      success: true,
      // user,
      token,
    });
  } catch (error) {
    throw new Error(error);
  }
});

export const logOutHander = errorHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.RefreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.RefreshToken;
  const decodeToken = jwt.verify(refreshToken, process.env.JWT_SECRET);
  const userId = decodeToken.id;
  const user = await usermodel.findById(userId);
  if (!user) {
    res.clearCookie("RefreshToken", {
      httpOnly: true,
      secure: true,
    });
    throw new Error("User Not Found");
    return res.status(204);
  }
  // if user find
  await usermodel.findByIdAndUpdate(user._id, {
    refreshToken: "",
  });
  res
    .clearCookie("RefreshToken", {
      httpOnly: true,
      secure: true,
    })
    .json({
      success: true,
      msg: "Logged Out",
    });
});

export const updatePassword = errorHandler(async (req, res) => {
  const { id } = req.user;
  const { password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await usermodel.findById(id);
    if (!user) throw new Error("User not found");
    if (password) {
      // user.password = password;
      user.password = hashedPassword;
      const updatePassword = await user.save();
      res.json(updatePassword);
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    throw new Error(error);
  }
});

export const forgetPassword = errorHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const user = await usermodel.findOne({ email: email });
    if (!user) throw new Error("User not found");
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = ` <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #f0f0f0; background-color: #333; padding: 20px; border-radius: 10px;">
                    <h2 style="background-color: #444; padding: 10px; text-align: center; color: #fff;">Password Reset Request</h2>
                    <p>Hi,</p>
                    <p>Please follow this link to reset your password. This link is valid for 10 minutes only.</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="http://localhost:3000/reset-password/${token}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; border-radius: 5px; text-decoration: none;">Reset Password</a>
                    </div>
                    <p>If you did not request a password reset, please ignore this email.</p>
                    <p>Thanks,</p>
                    <p>Luma Team</p>
                     <p>Ahsan Rasheed</p>
                     </div>`;
    // const resetURL = `Hi, Please follow this link to reset your password. This link is valid for 10 minutes only. <a href="http://localhost:3000/reset-password/${token}">Click Here</a>`;
    const data = {
      to: email,
      htm: resetURL,
      text: "hi User",
      subject: "Reset Password",
    };
    sendEmail(data);
    res.json({
      success: true,
      token,
      msg: "Password Reset Link Sent On Your Email",
    });
  } catch (error) {
    throw new Error(error);
  }
});

export const resetPassword = errorHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedPassword = await bcrypt.hash(password, 10);
  // const hashedtoken = crypto.createHash("sha256").update(token).digest("hex");
  // console.log(hashedtoken);
  try {
    const user = await usermodel.findOne({
      passwordResetToken: token,
      // passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error("User not found ");
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json({
      success: true,
      msg: "Password Reset Successful",
    });
  } catch (error) {
    throw new Error(error);
  }
});
