import express from "express";
import dotenv from "dotenv";
import dbconnect from "./config/dbconnect.js";
import userRouter from "./routes/authRoute.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { errorHandler, notfound } from "./middelware/errorHandler.js";
import productRouter from "./routes/productRoutes.js";
import blogRouter from "./routes/blogroutes.js";
import categoryRouter from "./routes/productCategoryRoute.js";
import blogCategoryRouter from "./routes/blogCatRoutes.js";
import brandCategoryRouter from "./routes/brandcatRoutes.js";
import couponRouter from "./routes/couponRoutes.js";
import morgan from "morgan";
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const PORT = process.env.PORT || 5000;

dbconnect();

app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/product-category", categoryRouter);
app.use("/api/blog-category", blogCategoryRouter);
app.use("/api/brand-category", brandCategoryRouter);
app.use("/api/coupon", couponRouter);

app.use(notfound);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
