import crypto from "crypto";
import mongoose from "mongoose";
import config from "./config";
import Category from "./models/Category";
import Product from "./models/Product";
import User from "./models/User";

const run = async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(config.db);
  const db = mongoose.connection;

  try {
    await db.dropCollection("categories");
    await db.dropCollection("products");
    await db.dropCollection("users");
  } catch (e) {
    console.log("Collections were not present, skipping drop...");
  }

  const [cpuCategory, ssdCategory] = await Category.create(
    {
      title: "CPUs",
      description: "Central Processor Units",
    },
    {
      title: "SSDs",
      description: "Solid State Drives",
    }
  );

  await Product.create(
    {
      title: "Intel Core i7 12700K",
      price: 350,
      category: cpuCategory._id,
      image: "http://localhost:8000/fixtures/cpu.jpg",
    },
    {
      title: "Samsung 990 Pro 1TB",
      price: 170,
      category: ssdCategory._id,
      image: "http://localhost:8000/fixtures/ssd.jpg",
    }
  );

  await User.create({
    username: "user",
    password: "1@345qWert",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NmFmM2IxY2Y3MDEwY2I4NTVlZGY2OSIsImlhdCI6MTczNTA2MjQ0OSwiZXhwIjoxNzM3NjU0NDQ5fQ.6FxlGjGUgpp30A5p0Cqc9iT5o-iS6-7ITncYoW5lrLI",
  });

  await db.close();
};

void run();
