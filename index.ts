import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import categoriesRouter from "./routers/categories";
import productsRouter from "./routers/products";
import usersRouter from "./routers/users";
import config from "./config";

const app = express();
const port = 8000;
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/products", productsRouter);
app.use("/categories", categoriesRouter);
app.use("/users", usersRouter);
const run = async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(config.db);

  app.listen(port, () => {
    console.log("Server %s on %d port!", "start", port);
  });

  process.on("exit", () => {
    mongoose.disconnect();
  });
};

run().catch(console.error);
