import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import colors from "colors";
import mongoose from "mongoose";
// import bodyParser from "body-parser";
import cors from "cors";

import { User } from "./model/user.js";
import logger from "./handlers/logger.js";
import productRouter from "./routes/product.js";
import { pageNotFound, error } from "./controllers/error.js";
import userRouter from "./routes/user.js";
import orderRouter from "./routes/order.js";

const app = express();
const config = dotenv.config();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
// app.use(bodyParser.json());

//middle wares
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);

app.use(pageNotFound);

app.use(error);

// connection
mongoose
  .connect(process.env.TEST_DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then((conn) => {
    logger.log("info", "DB connected");

    //start server
    app.listen(process.env.PORT || 5000, () =>
      logger.log(
        "info",
        `server running in ${process.env.NODE_ENV} on port 5000`
      )
    );
    return;
  })
  .then(async () => {
    //set super admin if he does not exist
    const users = await User.find();
    if (users.length === 0) {
      const adminUser = await new User({
        name: process.env.NAME,
        email: process.env.EMAIL,
        password: process.env.PASSWORD,
        isAdmin: true,
      });
      await adminUser.save();
      logger.log("info", "admin added");
    }
  })
  .catch((error) => logger.log("error", `${error.message}`.red.bold));
