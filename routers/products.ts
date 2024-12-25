import express, { Request, Response } from "express";
import { getImageURL, imagesUpload } from "../file/multer";
import Product from "../models/Product";
import { ProductMutation } from "../types";
import { Error } from "mongoose";
import auth from "../middleware/auth";
const productsRouter = express.Router();

productsRouter.get("/", auth, async (req: Request, res: Response) => {
  try {
    const products = await Product.find().populate("category");
    return res.send(products);
  } catch (e) {
    return res.sendStatus(500);
  }
});

productsRouter.get("/:id", auth, async (req, res) => {
  try {
    const result = await Product.findById(req.params.id);

    if (!result) {
      return res.sendStatus(404);
    }

    return res.send(result);
  } catch {
    return res.sendStatus(500);
  }
});

productsRouter.post(
  "/",
  imagesUpload.single("image"),
  auth,
  async (req: any, res: any, next: any) => {
    if (!req.body.title || !req.body.price) {
      return res.status(400).send({ error: "All fields are required" });
    }

    const productData: ProductMutation = {
      category: req.body.category,
      title: req.body.title,
      description: req.body.description,
      price: parseFloat(req.body.price),
      image: req.file ? getImageURL(req.file.filename) : null,
    };

    const product = new Product(productData);
    // const savedProduct = await fileDb.addItem(productData);
    try {
      await product.save();
      return res.send(product);
    } catch (e) {
      if (e instanceof Error.ValidationError) {
        return res.status(400).send(e);
      } else {
        return next(e);
      }
    }
  }
);

productsRouter.patch("/:id", auth, async (req, res, next) => {
  const result = await Product.findById(req.params.id);

  try {
    return res.send(result);
  } catch (e) {
    if (e instanceof Error.ValidationError) {
      return res.status(400).send(e);
    } else {
      return next(e);
    }
  }
});

export default productsRouter;
