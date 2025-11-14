import ProductModel from "../models/ProductModel.js";

export async function getProductsSvc({filter = null}) {
  try {
    const products = await ProductModel.find(filter);
    return products;

  } catch (e) {
    console.error(`[${getTimestamp()}] getProductsSvc FAILED:`, e);
    throw e; 
  }
}

export async function createProductSvc({ newProductData }) {
  try {
    const newProduct = await ProductModel.create(newProductData);
    return newProduct;

  } catch (e) {
    console.error(`[${getTimestamp()}] getProductsSvc FAILED:`, e);
    throw e;
  }
}