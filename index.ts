import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import categoriesRouter from "./routers/categories";
import productsRouter from "./routers/products";

const app = express();
const port = 8000;
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/products", productsRouter);
app.use("/categories", categoriesRouter);
const run = async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect("mongodb://localhost:27017/shop");

  app.listen(port, () => {
    console.log("Server %s on %d port!", "start", port);
  });

  process.on("exit", () => {
    mongoose.disconnect();
  });
};

run().catch(console.error);
