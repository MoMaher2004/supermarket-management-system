const billModel = require('../model/billModel')

const getBillById = async (req, res) => {
  const id = parseInt(req.params.id)
  if (isNaN(id) || id < 1) {
    return res.status(400).json({ message: 'Invalid bill ID' })
  }
  try {
    const bill = await billModel.getBillById(id)
    if (bill.error) {
      return res.status(404).json({ message: bill.error })
    }
    res.json(bill)
  } catch (error) {
    console.error('Error fetching bill:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
const addBill = async (req, res) => {
  const addedBy = req.user.id
  const { items } = req.body
  if (Array.isArray(items) === false || items.length === 0) {
    return res.status(400).json({ message: 'No items provided for the bill' })
  }
  for (const item of items) {
    if (
      !item.productId ||
      typeof item.productId !== 'number' ||
      item.productId < 0 ||
      !item.quantity ||
      typeof item.quantity !== 'number' ||
      item.quantity <= 0
    ) {
      return res.status(400).json({ message: 'Invalid item data' })
    }
  }
  try {
    const billId = await billModel.addBill(addedBy, items)
    res.status(201).json({ billId })
  } catch (error) {
    console.error('Error creating bill:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
const getBillsList = async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
    return res.status(400).json({ message: 'Invalid pagination parameters' })
  }
  if (limit > 100) {
    return res.status(400).json({ error: 'Limit cannot exceed 100' })
  }
  try {
    const bills = await billModel.getBillsList(page, limit)
    res.json(bills)
  } catch (error) {
    console.error('Error fetching bills list:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
const refundBill = async (req, res) => {
  const id = parseInt(req.body.id)
  if (isNaN(id) || id < 1) {
    return res.status(400).json({ message: 'Invalid bill ID' })
  }
  const refundedBy = req.user.id
  try {
    const result = await billModel.refundBill(id, refundedBy)
    if (result.error) {
      return res.status(404).json({ message: result.error })
    }
    res.status(200).json({ message: 'Bill refunded successfully' })
  } catch (error) {
    console.error('Error refunding bill:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
module.exports = {
  getBillById,
  addBill,
  getBillsList,
  refundBill
}