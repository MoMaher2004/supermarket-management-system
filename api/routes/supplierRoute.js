const {
  getSuppliersList,
  getSupplierById,
  addSupplier,
  editSupplier,
  deleteSupplier,
} = require('../controller/suppliersController')
const { verifyToken, checkUserRole } = require('../controller/userController')
const express = require('express')

const supplierRoute = express.Router()

supplierRoute.get(
  '/list',
  verifyToken,
  (req, res, next) => checkUserRole(req, res, next, ['owner', 'admin', 'supplier manager']),
  getSuppliersList,
)
supplierRoute.get(
  '/:id',
  verifyToken,
  (req, res, next) => checkUserRole(req, res, next, ['owner', 'admin', 'supplier manager']),
  getSupplierById,
)
supplierRoute.post(
  '/add',
  verifyToken,
  (req, res, next) => checkUserRole(req, res, next, ['owner', 'admin', 'supplier manager']),
  addSupplier,
)
supplierRoute.patch(
  '/edit',
  verifyToken,
  (req, res, next) => checkUserRole(req, res, next, ['owner', 'admin', 'supplier manager']),
  editSupplier,
)
supplierRoute.delete(
  '/delete',
  verifyToken,
  (req, res, next) => checkUserRole(req, res, next, ['owner', 'admin', 'supplier manager']),
  deleteSupplier,
)
module.exports = supplierRoute