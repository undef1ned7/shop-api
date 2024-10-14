import fileDb from "./fileDb";

const fetchProductById = async (id: string) => {
  await fileDb.init();

  const product = await fileDb.getItemById(id);

  if (product) {
    console.log("Product found:", product);
  } else {
    console.log("Product not found");
  }
};

fetchProductById("some-product-id");
