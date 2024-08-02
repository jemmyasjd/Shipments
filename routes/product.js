const express = require('express');
const {  getProducts, createProducts } = require('../controllers/Product');
const router = express.Router();

router.route('/').get(getProducts).post(createProducts);

module.exports = router;
