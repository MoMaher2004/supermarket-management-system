const conn = require('./db')

const addSupplier = async (name, phone, email) => {
  try {
    const [res] = await conn.query(
      'INSERT INTO suppliers (name, phone, email) VALUES (?, ?, ?)',
      [name, phone, email],
    )
    if (res.affectedRows === 0) {
      return { error: 'Failed to add supplier' }
    }
    return { success: 'Supplier added successfully' }
  } catch (error) {
    console.error('Error during login:', error)
    return { error: 'Something went wrong' }
  }
}

const getSupplierById = async (id) => {
  try {
    const [rows] = await conn.query('SELECT * FROM suppliers WHERE id = ?', [
      id,
    ])
    if (rows.length === 0) {
      return { error: 'Supplier not found' }
    }
    return rows[0]
  } catch (error) {
    console.error('Error during login:', error)
    return { error: 'Something went wrong' }
  }
}

const getSuppliersList = async (page = 1, limit = 20) => {
  try {
    const offset = (page - 1) * limit
    const [rows] = await conn.query(
      'SELECT * FROM suppliers LIMIT ? OFFSET ?',
      [limit, offset],
    )
    if (rows.length === 0) {
      return []
    }
    return rows
  } catch (error) {
    console.error('Error during login:', error)
    return { error: 'Something went wrong' }
  }
}

const editSupplier = async (id, name, phone, email) => {
  try {
    const [res] = await conn.query(
      'UPDATE suppliers SET name = ?, phone = ?, email = ? WHERE id = ?',
      [name, phone, email, id],
    )
    if (res.affectedRows === 0) {
      return { error: 'Failed to edit supplier' }
    }
    return { success: 'Supplier edited successfully' }
  } catch (error) {
    console.error('Error during login:', error)
    return { error: 'Something went wrong' }
  }
}

const deleteSupplier = async (id) => {
  try {
    const [res] = await conn.query('DELETE FROM suppliers WHERE id = ?', [id])
    if (res.affectedRows === 0) {
      return { error: 'Failed to delete supplier' }
    }
    return { success: 'Supplier deleted successfully' }
  } catch (error) {
    console.error('Error during login:', error)
    return { error: 'Something went wrong' }
  }
}

module.exports = {
  addSupplier,
  getSupplierById,
  getSuppliersList,
  editSupplier,
  deleteSupplier,
}
