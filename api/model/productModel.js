const conn = require('./db')

const getProductById = async (id) => {
  try {
    const [rows] = await conn.query('SELECT * FROM products WHERE id = ?', [id])
    if (rows.length === 0) {
      return { error: 'No product found' }
    }
    return rows[0]
  } catch (error) {
    console.error('Error during login:', error)
    return { error: 'Something went wrong' }
  }
}

const getProductsList = async (page = 1, limit = 20) => {
  try {
    const offset = (page - 1) * limit
    console.log(page, limit, offset)
    const [rows] = await conn.query('SELECT * FROM products LIMIT ? OFFSET ?', [
      limit,
      offset,
    ])
    if (rows.length === 0) {
      return []
    }
    return rows
  } catch (error) {
    console.error('Error during login:', error)
    return { error: 'Something went wrong' }
  }
}

const addProduct = async (
  name,
  sellingPrice,
  threshold,
  description,
  discount,
  barcode,
  category,
) => {
  try {
    const [res] = await conn.query(
      'INSERT INTO products (name, sellingPrice, threshold, description, discount, quantity, storeQuantity, barcode, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        name,
        sellingPrice,
        threshold,
        description,
        discount,
        0,
        0,
        barcode,
        category,
      ],
    )
    if (res.affectedRows === 0) {
      return { error: 'Failed to add product' }
    }
    return { success: 'Product added successfully' }
  } catch (error) {
    console.error('Error during login:', error)
    return { error: 'Something went wrong' }
  }
}

const editProduct = async (
  id,
  sellingPrice,
  threshold,
  description,
  discount,
  storeQuantity,
  barcode,
  category,
) => {
  try {
    const [res] = await conn.query(
      'UPDATE products SET sellingPrice = ?, threshold = ?, description = ?, discount = ?, barcode = ?, category = ?, storeQuantity = ? WHERE id = ?',
      [
        sellingPrice,
        threshold,
        description,
        discount,
        barcode,
        category,
        storeQuantity,
        id,
      ],
    )
    if (res.affectedRows === 0) {
      return { error: 'Failed to edit product' }
    }
    return { success: 'Product edited successfully' }
  } catch (error) {
    console.error('Error during login:', error)
    return { error: 'Something went wrong' }
  }
}

module.exports = {
  getProductById,
  getProductsList,
  addProduct,
  editProduct,
}
