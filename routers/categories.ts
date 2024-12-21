import express from "express";
import { Error } from "mongoose";
import Category from "../models/Category";
const categoriesRouter = express.Router();

categoriesRouter.get("/", async (req: any, res: any, next: any) => {
  try {
    const categories = await Category.find();
    return res.send(categories);
  } catch (e) {
    return next(e);
  }
});

categoriesRouter.post("/", async (req: any, res: any, next: any) => {
  const categoryData = {
    title: req.body.title,
    description: req.body.description,
  };

  const category = new Category(categoryData);

  try {
    await category.save();
    return res.send(category);
  } catch (e) {
    if (e instanceof Error.ValidationError) {
      return res.status(400).send(e);
    } else {
      return next(e);
    }
  }
});
export default categoriesRouter;