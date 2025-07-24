const {
  getShipmentsList,
  getShipmentById,
  addShipment,
  editShipment,
  getShipmentsListBySupplierId,
  getShipmentsListByProductId,
  deleteShipment,
  markShipmentAsReceived,
  markShipmentAsCancelled,
} = require('../controller/shipmentController')
const { verifyToken, checkUserRole } = require('../controller/userController')
const express = require('express')
const shipmentRoute = express.Router()

shipmentRoute.get(
  '/list',
  verifyToken,
  (req, res, next) => checkUserRole(req, res, next, ['owner', 'admin', 'supplier manager']),
  getShipmentsList,
)
shipmentRoute.get(
  '/:id',
  verifyToken,
  (req, res, next) => checkUserRole(req, res, next, ['owner', 'admin', 'supplier manager']),
  getShipmentById,
)
shipmentRoute.get(
  '/supplier/:id',
  verifyToken,
  (req, res, next) => checkUserRole(req, res, next, ['owner', 'admin', 'supplier manager']),
  getShipmentsListBySupplierId,
)
shipmentRoute.get(
  '/product/:id',
  verifyToken,
  (req, res, next) => checkUserRole(req, res, next, ['owner', 'admin', 'supplier manager']),
  getShipmentsListByProductId,
)
shipmentRoute.post(
  '/add',
  verifyToken,
  (req, res, next) => checkUserRole(req, res, next, ['owner', 'admin', 'supplier manager']),
  addShipment,
)
shipmentRoute.patch(
  '/edit',
  verifyToken,
  (req, res, next) => checkUserRole(req, res, next, ['owner', 'admin', 'supplier manager']),
  editShipment,
)
shipmentRoute.delete(
  '/delete',
  verifyToken,
  (req, res, next) => checkUserRole(req, res, next, ['owner', 'admin', 'supplier manager']),
  deleteShipment,
)
shipmentRoute.patch(
  '/markReceived',
  verifyToken,
  (req, res, next) => checkUserRole(req, res, next, ['owner', 'admin', 'supplier manager']),
  markShipmentAsReceived,
)
shipmentRoute.patch(
  '/markCancelled',
  verifyToken,
  (req, res, next) => checkUserRole(req, res, next, ['owner', 'admin', 'supplier manager']),
  markShipmentAsCancelled,
)
module.exports = shipmentRoute