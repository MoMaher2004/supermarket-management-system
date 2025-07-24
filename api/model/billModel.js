const pool = require('./db')

const getBillById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM bills WHERE id = ?', [id])
  if (rows.length === 0) {
    return { error: 'No bill found' }
  }
  return rows[0]
}

const addBill = async (addedBy, items) => {
  if (items.length === 0) {
    throw new Error('No items provided for the bill')
  }
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()
    const [res] = await conn.query(
      'INSERT INTO bills (addedAt, addedBy, refundedBy) VALUES (NOW(), ?, ?)',
      [addedBy, null],
    )
    const billId = res.insertId
    const { getProductById } = require('./productModel')
    items.forEach(async (item) => {
      const product = await getProductById(item.productId)
      if (!product) {
        await conn.rollback()
        throw new Error(`Product with ID ${item.quantity} not found`)
      }
      if (product.quantity - product.storeQuantity < item.quantity) {
        await conn.rollback()
        throw new Error(
          `Insufficient casheir stock for product ID ${item.quantity}`,
        )
      }
      const newQuantity = product.quantity - item.quantity
      const [updateRes] = await conn.query(
        'UPDATE products SET quantity = ? WHERE id = ?',
        [newQuantity, item.productId],
      )
      if (updateRes.affectedRows === 0) {
        await conn.rollback()
        throw new Error(`Failed to update product ID ${item.productId}`)
      }
      const [insertRes] = await conn.query(
        'INSERT INTO billItems (billId, product, price, quantity) VALUES (?, ?, ?, ?)',
        [billId, item.productId, (product.sellingPrice * (100 - product.discount) / 100), item.quantity],
      )
      if (insertRes.affectedRows === 0) {
        await conn.rollback()
        throw new Error(`Failed to insert item for bill ID ${billId}`)
      }
    })

    await conn.commit()
    return billId
  } catch (error) {
    await conn.rollback()
    throw error
  } finally {
    conn.release()
  }
}

const getBillsList = async (page = 1, limit = 20) => {
  const conn = await pool.getConnection()
  try {
    const offset = (page - 1) * limit
    const [rows] = await conn.query(
      'SELECT * FROM bills ORDER BY addedAt DESC LIMIT ? OFFSET ?',
      [limit, offset],
    )
    return rows
  } finally {
    conn.release()
  }
}

const refundBill = async (id, refundedBy) => {
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()
    const [res] = await conn.query(
      'UPDATE bills SET refundedAt = NOW(), refundedBy = ? WHERE id = ? AND refundedAt IS NULL',
      [refundedBy, id],
    )
    if (res.affectedRows === 0) {
      conn.rollback()
      return {error: 'Bill not found or already refunded'}
    }
    const [items] = await conn.query(
      'SELECT * FROM billItems WHERE billId = ?',
      [id],
    )
    if (items.length === 0) {
      conn.rollback()
      return {error: 'No items found for the bill'}
    }
    for (const item of items) {
      const [product] = await conn.query(
        'SELECT * FROM products WHERE id = ?',
        [item.product],
      )
      if (product.length === 0) {
        await conn.rollback()
        return {error: `Product with ID ${item.product} not found`}
      }
      const newQuantity = product[0].quantity + item.quantity
      const [updateRes] = await conn.query(
        'UPDATE products SET quantity = ? WHERE id = ?',
        [newQuantity, item.product],
      )
      if (updateRes.affectedRows === 0) {
        await conn.rollback()
        return {error: `Failed to update product ID ${item.product}`}
      }
    }
    await conn.commit()
    return { success: 'Bill refunded successfully' }
  } catch (error) {
    await conn.rollback()
    throw error
  } finally {
    conn.release()
  }
}

module.exports = {
  getBillById,
  addBill,
  getBillsList,
  refundBill,
}
