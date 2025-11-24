import ProductModel from "../models/ProductModel.js";

import { getTimestamp } from "../utils/timestamp.js";

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
    console.error(`[${getTimestamp()}] createProductsSvc FAILED:`, e);
    throw e;
  }
}

export async function getProductForOrderSvc({ productCode, quantity, caller = null }) {
  try {
    const product = await ProductModel.findOne({
      productCode,
      status: "active",
    }); 
    
    if (!product) {
      throw new Error(`[${getTimestamp()}] [${caller}] [getProductForOrderSvc] Product ${productCode} not found or inactive`);
    } else {
      console.log(`[${getTimestamp()}] [${caller}] [getProductForOrderSvc] Product ${productCode} found: ${product._id}`);
    }
    
    if (product.stockType === "SOH" && product.stock < quantity) {
      throw new Error(`[${getTimestamp()}] [${caller}] [getProductForOrderSvc] Product ${productCode} insufficient stock quantity`);
    } else {
      console.log(`[${getTimestamp()}] [${caller}] [getProductForOrderSvc] Product ${productCode} sufficient stock quantity`);
    }

    return product;
    
  } catch (e) {
    console.error(`[${getTimestamp()}] [${caller}] [getProductForOrderSvc] getProductForOrderSvc FAILED:`, e);
    throw e;
  }
}

export async function deductProductStockSvc({ product, quantity, caller = null }) {
  try {
    const updatedProduct = await ProductModel.updateOne(
      { _id: product._id, stock: { $gte: quantity } },
      { $inc: { stock: -quantity } }
    );

    if (updatedProduct.modifiedCount === 0) {
      throw new Error(`[${getTimestamp()}] [${caller}] [deductProductStockSvc] FAILED: insufficient stock during update`);
    }
    console.log(`[${getTimestamp()}] [${caller}] [deductProductStockSvc] Product ${product.productCode} stock quantity reduced by: ${quantity}`);

    return updatedProduct;
    
  } catch (e) {
    console.error(`[${getTimestamp()}] [${caller}] [deductProductStockSvc] deductProductStockSvc FAILED:`, e);
    throw e;
  }
}

export async function updateProductSvc({ productId, newValues, caller = null }) {
  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      {
        ...newValues,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      throw new Error(
        `[${getTimestamp()}] [${caller}] updateProductSvc FAILED: Product ${productId} not found`
      );
    }

    console.log(
      `[${getTimestamp()}] [${caller}] updateProductSvc: Product ${productId} updated ->`,
      newValues
    );

    return updatedProduct;

  } catch (e) {
    console.error(
      `[${getTimestamp()}] [${caller}] updateProductSvc FAILED:`, e
    );
    throw e;
  }
}