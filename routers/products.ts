import express from "express";
import fileDb from "../file/fileDb";
import { getImageURL, imagesUpload } from "../file/multer";
import { ProductWithoutId } from "../types";
const productsRouter = express.Router();

productsRouter.get("/", async (req, res) => {
  const products = await fileDb.getItems();
  res.send(products);
});

productsRouter.get("/:id", async (req, res) => {
  const products = await fileDb.getItems();
  const product = products.find((p) => p.id === req.params.id);
  res.send(product);
});

productsRouter.post("/", imagesUpload.single("image"), async (req, res) => {
  const product: ProductWithoutId = {
    title: req.body.title,
    description: req.body.description,
    price: parseInt(req.body.price),
    image: req.file ? getImageURL(req.file.filename) : null,
  };

  const savedProduct = await fileDb.addItem(product);
  res.send(savedProduct);
});

export default productsRouter;
