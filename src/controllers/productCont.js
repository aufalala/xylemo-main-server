import { createProductSvc, getProductsSvc } from "../services/productSvc.js";

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