const shipmentModel = require('../model/shipmentModel')

const getShipmentsList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
      return res.status(400).json({ error: 'Invalid pagination parameters' })
    }
    const shipments = await shipmentModel.getShipmentsList(page, limit)

    if (shipments.length === 0) {
      return res.status(404).json({ error: 'No shipments found' })
    }

    return res.status(200).json(shipments)
  } catch (error) {
    console.error('getShipmentsList error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error, Please try again' })
  }
}
const getShipmentById = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id) || id < 0) {
      return res.status(400).json({ error: 'Enter a valid ID' })
    }
    const shipment = await shipmentModel.getShipmentById(id)

    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' })
    }

    return res.status(200).json(shipment)
  } catch (error) {
    console.error('getShipmentById error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error, Please try again' })
  }
}
const getShipmentsListBySupplierId = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const supplierId = parseInt(req.params.id)
    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
      return res.status(400).json({ error: 'Invalid pagination parameters' })
    }
    if (isNaN(supplierId) || supplierId < 0) {
      return res.status(400).json({ error: 'Enter a valid ID' })
    }
    const shipments = await shipmentModel.getShipmentsListBySupplierId(
      supplierId,
      page,
      limit,
    )

    if (shipments.length === 0) {
      return res
        .status(404)
        .json({ error: 'No shipments found for this supplier' })
    }

    return res.status(200).json(shipments)
  } catch (error) {
    console.error('getShipmentsListBySupplierId error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error, Please try again' })
  }
}
const getShipmentsListByProductId = async (req, res) => {
  try {
    const productId = parseInt(req.params.id)
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
      return res.status(400).json({ error: 'Invalid pagination parameters' })
    }
    if (isNaN(productId) || productId < 0) {
      return res.status(400).json({ error: 'Enter a valid ID' })
    }
    const shipments = await shipmentModel.getShipmentsListByProductId(
      productId,
      page,
      limit,
    )

    if (shipments.length === 0) {
      return res
        .status(404)
        .json({ error: 'No shipments found for this product' })
    }

    return res.status(200).json(shipments)
  } catch (error) {
    console.error('getShipmentsListByProductId error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error, Please try again' })
  }
}
const addShipment = async (req, res) => {
  try {
    const {
      productId,
      quantity,
      supplierId,
      pricePerUnit,
      totalPrice,
      deferredPayment,
      expectedAt,
      expiryDate,
      notes,
    } = req.body

    if (
      productId == null ||
      typeof productId !== 'number' ||
      productId < 0 ||
      !quantity ||
      typeof quantity !== 'number' ||
      quantity < 1 ||
      supplierId == null ||
      typeof supplierId !== 'number' ||
      supplierId < 0 ||
      !pricePerUnit ||
      typeof pricePerUnit !== 'number' ||
      pricePerUnit <= 0 ||
      !totalPrice ||
      typeof totalPrice !== 'number' ||
      totalPrice <= 0 ||
      !deferredPayment ||
      typeof deferredPayment !== 'number' ||
      deferredPayment < 0 ||
      !expectedAt ||
      isNaN(new Date(expectedAt).getTime()) ||
      isNaN(new Date(expiryDate).getTime()) ||
      new Date(expectedAt) <= new Date() ||
      new Date(expiryDate) < new Date() ||
      (notes && typeof notes !== 'string') ||
      quantity * pricePerUnit > totalPrice
    ) {
      return res.status(400).json({ error: 'Please enter valid data' })
    }

    const userId = req.user.id

    const result = await shipmentModel.addShipment(
      productId,
      quantity,
      supplierId,
      userId,
      pricePerUnit,
      totalPrice,
      deferredPayment,
      expectedAt,
      expiryDate,
      notes,
    )

    if (result.error) {
      return res.status(400).json({ error: result.error })
    }

    return res.status(201).json(result)
  } catch (error) {
    console.error('addShipment error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error, Please try again' })
  }
}
const editShipment = async (req, res) => {
  try {
    const id = parseInt(req.body.id)
    const {
      quantity,
      supplierId,
      pricePerUnit,
      totalPrice,
      deferredPayment,
      status,
      expectedAt,
      expiryDate,
      notes,
    } = req.body

    if (
      isNaN(id) ||
      id < 0 ||
      !quantity ||
      quantity < 1 ||
      typeof quantity !== 'number' ||
      supplierId == null ||
      supplierId < 0 ||
      typeof supplierId !== 'number' ||
      !pricePerUnit ||
      pricePerUnit <= 0 ||
      typeof pricePerUnit !== 'number' ||
      !totalPrice ||
      totalPrice <= 0 ||
      typeof totalPrice !== 'number' ||
      !deferredPayment ||
      typeof deferredPayment !== 'number' ||
      deferredPayment < 0 ||
      !status ||
      !['pending', 'received', 'cancelled'].includes(status) ||
      !expectedAt ||
      isNaN(new Date(expectedAt).getTime()) ||
      isNaN(new Date(expiryDate).getTime()) ||
      new Date(expectedAt) <= new Date() ||
      new Date(expiryDate) < new Date() ||
      (notes && typeof notes !== 'string') ||
      quantity * pricePerUnit > totalPrice
    ) {
      return res.status(400).json({ error: 'Please enter valid data' })
    }

    const result = await shipmentModel.editShipment(
      id,
      quantity,
      supplierId,
      pricePerUnit,
      totalPrice,
      deferredPayment,
      status,
      expectedAt,
      expiryDate,
      notes,
    )

    if (result.error) {
      return res.status(400).json({ error: result.error })
    }

    return res.status(200).json(result)
  } catch (error) {
    console.error('editShipment error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error, Please try again' })
  }
}

const deleteShipment = async (req, res) => {
  try {
    const id = parseInt(req.body.id)
    if (isNaN(id) || id < 0) {
      return res.status(400).json({ error: 'Please enter valid ID' })
    }
    const result = await shipmentModel.deleteShipment(id)

    if (result.error) {
      return res.status(400).json({ error: result.error })
    }

    return res.status(200).json(result)
  } catch (error) {
    console.error('deleteShipment error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error, Please try again' })
  }
}

const markShipmentAsReceived = async (req, res) => {
  try {
    const id = parseInt(req.body.id)
    if (isNaN(id) || id < 0) {
      return res.status(400).json({ error: 'Please enter valid ID' })
    }
    const userId = req.user.id
    const result = await shipmentModel.markShipmentAsReceived(id, userId)

    if (result.error) {
      return res.status(400).json({ error: result.error })
    }

    return res.status(200).json(result)
  } catch (error) {
    console.error('markShipmentAsReceived error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error, Please try again' })
  }
}

const markShipmentAsCancelled = async (req, res) => {
  try {
    const id = parseInt(req.body.id)
    if (isNaN(id) || id < 0) {
      return res.status(400).json({ error: 'Please enter valid ID' })
    }
    const userId = req.user.id
    const result = await shipmentModel.markShipmentAsCancelled(id, userId)

    if (result.error) {
      return res.status(400).json({ error: result.error })
    }

    return res.status(200).json(result)
  } catch (error) {
    console.error('markShipmentAsCancelled error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error, Please try again' })
  }
}

module.exports = {
  getShipmentsList,
  getShipmentById,
  getShipmentsListBySupplierId,
  getShipmentsListByProductId,
  addShipment,
  editShipment,
  deleteShipment,
  markShipmentAsReceived,
  markShipmentAsCancelled,
}
