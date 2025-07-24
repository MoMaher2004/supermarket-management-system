const productModel = require('../model/productModel')
const va = require('../utils/validators')

const getProductsList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const products = await productModel.getProductsList(page, limit)

    if (products.length === 0) {
      return res.status(200).json({ error: 'No products found' })
    }

    return res.status(200).json(products)
  } catch (error) {
    console.error('getProductsList error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error, Please try again' })
  }
}

const getProductById = async (req, res) => {
  try {
    const id = req.params.id
    const product = await productModel.getProductById(id)

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    return res.status(200).json(product)
  } catch (error) {
    console.error('getProductById error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error, Please try again' })
  }
}

const addProduct = async (req, res) => {
  try {
    const {
      name,
      sellingPrice,
      threshold,
      description,
      discount,
      barcode,
      category,
    } = req.body

    if (
      !name ||
      !sellingPrice ||
      sellingPrice <= 0 ||
      !threshold ||
      threshold < 0 ||
      !category ||
      typeof sellingPrice !== 'number' ||
      typeof threshold !== 'number' ||
      typeof barcode !== 'string' ||
      typeof description !== 'string' ||
      typeof discount !== 'number'
    ) {
      return res
        .status(400)
        .json({ error: 'All fields are required and must be valid' })
    }

    const result = await productModel.addProduct(
      name,
      sellingPrice,
      threshold,
      description,
      discount,
      barcode,
      category,
    )

    if (result.error) {
      return res.status(400).json({ error: result.error })
    }

    return res.status(201).json(result)
  } catch (error) {
    console.error('addProduct error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error, Please try again' })
  }
}

const editProduct = async (req, res) => {
  try {
    const id = parseInt(req.body.id)
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: 'Valid product ID is required' })
    }
    const {
      sellingPrice,
      threshold,
      description,
      discount,
      storeQuantity,
      barcode,
      category,
    } = req.body
    if (
      !sellingPrice ||
      sellingPrice <= 0 ||
      !threshold ||
      threshold < 0 ||
      !category ||
      typeof sellingPrice !== 'number' ||
      typeof threshold !== 'number' ||
      typeof barcode !== 'string' ||
      typeof description !== 'string' ||
      typeof discount !== 'number' ||
      typeof storeQuantity !== 'number' ||
      storeQuantity < 0
    ) {
      return res
        .status(400)
        .json({ error: 'All fields are required and must be valid' })
    }

    const product = await productModel.getProductById(id)
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    if (product.quantity < storeQuantity) {
      return res
        .status(400)
        .json({ error: 'Store quantity cannot exceed available stock' })
    }

    const result = await productModel.editProduct(
      id,
      sellingPrice,
      threshold,
      description,
      discount,
      storeQuantity,
      barcode,
      category,
    )

    if (result.error) {
      return res.status(400).json({ error: result.error })
    }

    return res.status(200).json(result)
  } catch (error) {
    console.error('editProduct error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error, Please try again' })
  }
}

module.exports = {
  getProductsList,
  getProductById,
  addProduct,
  editProduct,
}
