const {
  getProductsList,
  getProductById,
  addProduct,
  editProduct,
} = require('../controller/productController')
const { verifyToken, checkUserRole } = require('../controller/userController')
const express = require('express')

const productRoute = express.Router()
productRoute.get(
  '/list',
  verifyToken,
  (req, res, next) =>
    checkUserRole(req, res, next, ['owner', 'admin', 'storage manager']),
  getProductsList,
)
productRoute.get(
  '/:id',
  verifyToken,
  (req, res, next) =>
    checkUserRole(req, res, next, ['owner', 'admin', 'storage manager']),
  getProductById,
)
productRoute.post(
  '/add',
  verifyToken,
  (req, res, next) =>
    checkUserRole(req, res, next, ['owner', 'admin', 'storage manager']),
  addProduct,
)
productRoute.patch(
  '/edit',
  verifyToken,
  (req, res, next) =>
    checkUserRole(req, res, next, ['owner', 'admin', 'storage manager']),
  editProduct,
)

module.exports = productRoute
