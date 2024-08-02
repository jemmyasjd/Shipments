const Product = require("../models/productSchema");

async function createProducts(req, res) {
    try {
      const products = req.body;
      await Product.insertMany(products);
      res.json({ message: "Products created successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

async function getProducts(req, res) {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { createProducts, getProducts };
