const supplierModel = require('../model/supplierModel')
const validators = require('../utils/validators')

const getSuppliersList = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 20
    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return res.status(400).json({ error: 'Invalid page or limit' })
    }
    if (limit > 100) {
      return res.status(400).json({ error: 'Limit cannot exceed 100' })
    }
    const suppliers = await supplierModel.getSuppliersList(page, limit)
    if (!suppliers) {
      return res.status(404).json({ error: 'No suppliers found' })
    }
    if (suppliers.error) {
      return res.status(400).json({ error: suppliers.error })
    }
    return res.status(200).json(suppliers)
  } catch (error) {
    console.error('getSuppliersList error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error, Please try again' })
  }
}

const getSupplierById = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid supplier ID' })
    }
    const supplier = await supplierModel.getSupplierById(id)

    if (supplier.error) {
      return res.status(404).json({ error: supplier.error })
    }

    return res.status(200).json(supplier)
  } catch (error) {
    console.error('getSupplierById error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error, Please try again' })
  }
}

const addSupplier = async (req, res) => {
  try {
    const { name, phone, email } = req.body
    if (
      !name ||
      !validators.isValidPhoneNumber(phone) ||
      !validators.isValidEmail(email)
    ) {
      return res.status(400).json({ error: 'Invalid input data' })
    }
    const result = await supplierModel.addSupplier(name, phone, email)

    if (result.error) {
      return res.status(400).json({ error: result.error })
    }

    return res.status(201).json(result)
  } catch (error) {
    console.error('addSupplier error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error, Please try again' })
  }
}

const editSupplier = async (req, res) => {
  try {
    const id = parseInt(req.body.id)
    const { name, phone, email } = req.body
    if (
      isNaN(id) ||
      !name ||
      !validators.isValidPhoneNumber(phone) ||
      !validators.isValidEmail(email)
    ) {
      return res.status(400).json({ error: 'Invalid input data' })
    }
    const result = await supplierModel.editSupplier(id, name, phone, email)

    if (result.error) {
      return res.status(400).json({ error: result.error })
    }

    return res.status(200).json(result)
  } catch (error) {
    console.error('editSupplier error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error, Please try again' })
  }
}

const deleteSupplier = async (req, res) => {
  try {
    const id = parseInt(req.body.id)
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid supplier ID' })
    }
    const result = await supplierModel.deleteSupplier(id)

    if (result.error) {
      return res.status(400).json({ error: result.error })
    }

    return res.status(200).json(result)
  } catch (error) {
    console.error('deleteSupplier error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error, Please try again' })
  }
}

module.exports = {
  getSuppliersList,
  getSupplierById,
  addSupplier,
  editSupplier,
  deleteSupplier,
}
