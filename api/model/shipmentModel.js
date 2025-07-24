const pool = require('./db')

const getShipmentById = async (id) => {
  try {
    const [rows] = await pool.query('SELECT * FROM shipments WHERE id = ?', [
      id,
    ])
    if (rows.length === 0) {
      return null
    }
    return rows[0]
  } catch (error) {
    console.error('Error during login:', error)
    return { error: 'Something went wrong' }
  }
}
const getShipmentsListBySupplierId = async (
  supplierId,
  page = 1,
  limit = 20,
) => {
  try {
    const offset = (page - 1) * limit
    const [rows] = await pool.query(
      'SELECT * FROM shipments WHERE supplierId = ? LIMIT ? OFFSET ?',
      [supplierId, limit, offset],
    )
    return rows
  } catch (error) {
    console.error('Error during login:', error)
    return { error: 'Something went wrong' }
  }
}
const getShipmentsListByProductId = async (productId, page = 1, limit = 20) => {
  try {
    const offset = (page - 1) * limit
    const [rows] = await pool.query(
      'SELECT * FROM shipments WHERE productId = ? LIMIT ? OFFSET ?',
      [productId, limit, offset],
    )
    return rows
  } catch (error) {
    console.error('Error during login:', error)
    return { error: 'Something went wrong' }
  }
}
const getShipmentsList = async (page = 1, limit = 20) => {
  try {
    const offset = (page - 1) * limit
    const [rows] = await pool.query(
      'SELECT * FROM shipments LIMIT ? OFFSET ?',
      [limit, offset],
    )
    return rows
  } catch (error) {
    console.error('Error during login:', error)
    return { error: 'Something went wrong' }
  }
}
const addShipment = async (
  productId,
  quantity,
  supplierId,
  addedBy,
  pricePerUnit,
  totalPrice,
  deferredPayment,
  expectedAt,
  expiryDate,
  notes,
) => {
  try {
    const [res] = await pool.query(
      'INSERT INTO shipments (productId, quantity, supplierId, addedBy, receivedBy, pricePerUnit, totalPrice, deferredPayment, status, issuedAt, receivedAt, expectedAt, expiryDate, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        productId,
        quantity,
        supplierId,
        addedBy,
        null,
        pricePerUnit,
        totalPrice,
        deferredPayment,
        'pending',
        new Date().toISOString().slice(0, 19).replace('T', ' '),
        null,
        expectedAt,
        expiryDate,
        notes,
      ],
    )
    if (res.affectedRows === 0) {
      return { error: 'Failed to add shipment' }
    }
    return { success: 'Shipment added successfully' }
  } catch (error) {
    console.error('Error during login:', error)
    return { error: 'Something went wrong' }
  }
}
const editShipment = async (
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
) => {
  try {
    const [res] = await pool.query(
      'UPDATE shipments SET quantity = ?, supplierId = ?, pricePerUnit = ?, totalPrice = ?, deferredPayment = ?, status = ?, expectedAt = ?, expiryDate = ?, notes = ? WHERE id = ?',
      [
        quantity,
        supplierId,
        pricePerUnit,
        totalPrice,
        deferredPayment,
        status,
        expectedAt,
        expiryDate,
        notes,
        id,
      ],
    )
    if (res.affectedRows === 0) {
      return { error: 'Failed to edit shipment' }
    }
    return { success: 'Shipment edited successfully' }
  } catch (error) {
    console.error('Error during login:', error)
    return { error: 'Something went wrong' }
  }
}
const deleteShipment = async (id) => {
  try {
    const [res] = await pool.query('DELETE FROM shipments WHERE id = ?', [id])
    if (res.affectedRows === 0) {
      return { error: 'Failed to delete shipment' }
    }
    return { success: 'Shipment deleted successfully' }
  } catch (error) {
    console.error('Error during login:', error)
    return { error: 'Something went wrong' }
  }
}
const markShipmentAsReceived = async (id, receivedBy) => {
  try {
    let conn
    try {
      conn = await pool.getConnection()
      await conn.beginTransaction()
      const [res] = await conn.query(
        'UPDATE shipments SET status = "received", receivedAt = ?, receivedBy = ? WHERE id = ?',
        [new Date().toISOString().slice(0, 19).replace('T', ' '), receivedBy, id],
      )
      if (res.affectedRows === 0) {
        await conn.rollback()
        throw new Error('Failed to mark shipment as received')
      }
      const [shipment] = await conn.query(
        'SELECT quantity, productId FROM shipments WHERE id = ? FOR UPDATE',
        [id],
      )
      if (shipment.length === 0) {
        await conn.rollback()
        throw new Error('Shipment not found')
      }
      const [trig] = await conn.query(
        'UPDATE products SET quantity = quantity + ? WHERE id = ?',
        [shipment[0].quantity, shipment[0].productId],
      )
      if (trig.affectedRows === 0) {
        await conn.rollback()
        throw new Error('Failed to update product quantity')
      }
      await conn.commit()
      return { success: 'Shipment marked as received successfully' }
    } catch (error) {
      await conn.rollback()
      return { error: error.message }
    } finally {
      if (conn) conn.release()
    }
  } catch (error) {
    console.error('Error during login:', error)
    return { error: 'Something went wrong' }
  }
}
const markShipmentAsCancelled = async (id, cancelledBy) => {
  try {
    const [res] = await pool.query(
      'UPDATE shipments SET status = "cancelled", receivedAt = ?, receivedBy = ? WHERE id = ? AND status = "pending"',
      [new Date().toISOString().slice(0, 19).replace('T', ' '), cancelledBy, id],
    )
    if (res.affectedRows === 0) {
      return { error: 'Failed to mark shipment as cancelled' }
    }
    return { success: 'Shipment marked as cancelled successfully' }
  } catch (error) {
    console.error('Error during login:', error)
    return { error: 'Something went wrong' }
  }
}
module.exports = {
  getShipmentById,
  getShipmentsListBySupplierId,
  getShipmentsListByProductId,
  getShipmentsList,
  addShipment,
  editShipment,
  deleteShipment,
  markShipmentAsReceived,
  markShipmentAsCancelled,
}
