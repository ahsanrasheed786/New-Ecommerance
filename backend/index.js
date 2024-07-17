import express from "express";
import dotenv from "dotenv";
import dbconnect from "./config/dbconnect.js";
import userRouter from "./routes/authRoute.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { errorHandler, notfound } from "./middelware/errorHandler.js";
import productRouter from "./routes/productRoutes.js";
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
app.use(notfound);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
