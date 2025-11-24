import { createProductSvc, getProductsSvc, updateProductSvc } from "../services/productSvc.js";
import { broadcastEvent } from "../sse/sseManager.js";

import { getTimestamp } from "../utils/timestamp.js";

export async function getProductsCont({ req, res, filter = null }) {
  try {
    const products = await getProductsSvc({filter});
    return res.status(200).json(products);
    
  } catch (e) {
    res.status(500).json({ err: err.message });
  }
}

export async function createProductCont({ req, res }) {
  try {
    const newProductData = {
      productName: req.body.productName,
      productCode: req.body.productCode,
      stock: req.body.stock,
      stockType: req.body.stockType,
      status: req.body.status,
    }
    const product = await createProductSvc({ newProductData });
    return res.status(200).json(product);

  } catch (e) {
    res.status(500).json({ err: err.message });
  }
}

export async function updateProductCont({ req, res }) {
  try {
    const { id: productId } = req.params;
    const newValues = req.body;

    const updatedProduct = await updateProductSvc({
      productId,
      newValues,
      caller: "updateProductCont",
    });

    broadcastEvent({
      type: "update_product",
      product: updatedProduct,
    }, "updateProductCont");

    return res.status(200).json(updatedProduct);

  } catch (e) {
    console.error(
      `[${getTimestamp()}] updateProductCont FAILED:`,
      e
    );
    res.status(500).json({ message: "Failed to update product status" });
  }
}
