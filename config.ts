import path from "path";

const rootPath = __dirname;

const config = {
  rootPath,
  publicPath: path.join(rootPath, "public"),
  db: "mongodb://localhost:27017/shop",
  JWT_SECRET: "BB8u!)28|>f(Ok7v'BE$i&5QC{iR{q",
};

export default config;
