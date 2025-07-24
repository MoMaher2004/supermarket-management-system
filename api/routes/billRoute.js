const billController = require('../controller/billController')
const { verifyToken, checkUserRole } = require('../controller/userController')
const express = require('express')

const billRoute = express.Router()
billRoute.post(
  '/add',
  verifyToken,
  (req, res, next) =>
    checkUserRole(req, res, next, ['owner', 'admin', 'cashier']),
  billController.addBill,
)
billRoute.get(
  '/list',
  verifyToken,
  (req, res, next) =>
    checkUserRole(req, res, next, ['owner', 'admin', 'cashier']),
  billController.getBillsList,
)
billRoute.patch(
  '/refund',
  verifyToken,
  (req, res, next) =>
    checkUserRole(req, res, next, ['owner', 'admin', 'cashier']),
  billController.refundBill,
)
billRoute.get(
  '/:id',
  verifyToken,
  (req, res, next) =>
    checkUserRole(req, res, next, ['owner', 'admin', 'cashier']),
  billController.getBillById,
)
module.exports = billRoute