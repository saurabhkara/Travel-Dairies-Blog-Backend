import express from "express";
import mongoose from "mongoose";
import { DB_PASSWORD, APP_PORT } from "./config";
import route from './routing/userRouting';
import postRoute from "./routing/postRouting";
import errorHandler from "./middleware/errorHandler";
import cors from 'cors'
const app = express();

//Middleware
app.use(cors());
app.use(express.json());
app.use('/user',route);
app.use('/post',postRoute);
app.use(errorHandler);
//Database Connection
mongoose.set("strictQuery", false);
mongoose
  .connect(
    `mongodb+srv://admin:${DB_PASSWORD}@cluster0.hzrw6hn.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(APP_PORT, () => {
      console.log(`Connection Successful and Server is running on ${APP_PORT}`);
    });
  })
  .catch((error) => {
    console.log("Database Connection :", error);
  });
