const conn = require('./db')

const login = async (username, password) => {
  try {
    const [rows] = await conn.query('SELECT * FROM users WHERE username = ?', [
      username,
    ])

    if (rows.length === 0) {
      return null
    }
    const bcrypt = require('bcrypt')
    if (!(await bcrypt.compare(password, rows[0].password))) {
      return null
    }
    rows[0].password = undefined
    rows[0].isDeleted = undefined
    return rows[0]
  } catch (error) {
    console.error('Error during login:', error)
    return { error: 'Something went wrong' }
  }
}

const changePassword = async (username, oldPassword, newPassword) => {
  try {
    const loginRes = await login(username, oldPassword)
    if (!loginRes) {
      return { error: 'Old password is incorrect' }
    }
    const bcrypt = require('bcrypt')
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    const [res] = await conn.query(
      'UPDATE users SET password = ?, passwordUpdatedAt = ? WHERE username = ?',
      [hashedPassword, new Date().toISOString().slice(0, 19).replace('T', ' '), username],
    )
    if (res.affectedRows === 0) {
      return { error: 'Failed to change password' }
    }
    return { success: 'Password changed successfully' }
  } catch (error) {
    console.error('Error during login:', error)
    return { error: 'Something went wrong' }
  }
}

const checkPasswordChange = async (id) => {
  try {
    const [rows] = await conn.query(
      'SELECT passwordUpdatedAt FROM users WHERE id = ?',
      [id],
    )
    return rows[0].passwordUpdatedAt
  } catch (error) {
    console.error('Error during login:', error)
    return { error: 'Something went wrong' }
  }
}

const getUserById = async (id) => {
  try {
    const [rows] = await conn.query('SELECT * FROM users WHERE id = ?', [id])
    if (rows.length === 0) {
      return null
    }
    rows[0].password = undefined
    return rows[0]
  } catch (error) {
    console.error('Error during login:', error)
    return { error: 'Something went wrong' }
  }
}

const updateUserRole = async (id, role) => {
  try {
    const [res] = await conn.query('UPDATE users SET role = ? WHERE id = ?', [
      role,
      id,
    ])
    if (res.affectedRows === 0) {
      return { error: 'Failed to update user role' }
    }
    return { success: 'User role updated successfully' }
  } catch (error) {
    console.error('Error during login:', error)
    return { error: 'Something went wrong' }
  }
}

const updateUserPhone = async (id, phone) => {
  try {
    const [res] = await conn.query('UPDATE users SET phone = ? WHERE id = ?', [
      phone,
      id,
    ])
    if (res.affectedRows === 0) {
      return { error: 'Failed to update user phone' }
    }
    return { success: 'User phone updated successfully' }
  } catch (error) {
    console.error('Error during login:', error)
    return { error: 'Something went wrong' }
  }
}

const deactivateUser = async (id) => {
  try {
    const [res] = await conn.query('UPDATE users SET isDeleted = 1 WHERE id = ?', [
      id,
    ])
    if (res.affectedRows === 0) {
      return { error: 'Failed to deactivate user' }
    }
    return { success: 'User deactivated successfully' }
  } catch (error) {
    console.error('Error during login:', error)
    return { error: 'Something went wrong' }
  }
}

const addUser = async (username, password, role, phone, fullName) => {
  try {
    const bcrypt = require('bcrypt')
    const hashedPassword = await bcrypt.hash(password, 10)
    const checkUsername = await conn.query(
      'SELECT * FROM users WHERE username = ?',
      [username],
    )
    if (checkUsername[0].length > 0) {
      return { error: 'Username already exists' }
    }
    const [res] = await conn.query(
      'INSERT INTO users (username, password, role, phone, isDeleted, fullName, passwordUpdatedAt, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        username,
        hashedPassword,
        role,
        phone,
        false,
        fullName,
        new Date().toISOString().slice(0, 19).replace('T', ' '),
        new Date().toISOString().slice(0, 19).replace('T', ' '),
      ],
    )
    if (res.affectedRows === 0) {
      return { error: 'Failed to add user' }
    }
    return { success: 'User added successfully' }
  } catch (error) {
    console.error('Error during login:', error)
    return { error: 'Something went wrong' }
  }
}

const getUsersList = async (page = 1, limit = 20, isDeleted = false) => {
  try {
    const offset = (page - 1) * limit
    const [rows] = await conn.query(
      'SELECT fullName, id, role FROM users WHERE isDeleted = ? LIMIT ? OFFSET ?',
      [isDeleted, limit, offset],
    )
    return rows
  } catch (error) {
    console.error('Error during login:', error)
    return { error: 'Something went wrong' }
  }
}

module.exports = {
  login,
  changePassword,
  checkPasswordChange,
  getUserById,
  updateUserRole,
  updateUserPhone,
  deactivateUser,
  addUser,
  getUsersList,
}
