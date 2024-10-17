import express from "express";
import cors from "cors";
import productsRouter from "./routers/products";
import fileDb from "./file/fileDb";

const app = express();
const port = 8000;
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/products", productsRouter);
const run = async () => {
  await fileDb.init();

  app.listen(port, () => {
    console.log("Server %s on %d port!", "start", port);
  });
};

run().catch(console.error);
