const userModel = require('../model/userModel')
const va = require('../utils/validators')

const jwt = require('jsonwebtoken')

const createToken = (id, username) => {
  return jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  })
}

const invalidateToken = (res) => {
  res.clearCookie('token', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  })
  return true
}

const logout = (req, res) => {
  try {
    invalidateToken(res)
    return res
      .status(200)
      .json({ message: 'Logged out successfully', redirect: '/login' })
  } catch (error) {
    console.error('Logout error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error, Please try again' })
  }
}

const verifyToken = async (req, res, next) => {
  try {
    if (!req.headers['authorization']) {
      return res
        .status(403)
        .json({ error: 'No token provided, Please login again', redirect: '/login' })
    }
    const token = req.headers['authorization'].split(' ')[1]
    if (!token) {
      return res
        .status(403)
        .json({ error: 'No token provided', redirect: '/login' })
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ error: 'Failed to authenticate token', redirect: '/login' })
      }
      const passwordUpdatedAt = new Date(
        await userModel.checkPasswordChange(decoded.id),
      )
      const tokenIssuedAt = new Date(decoded.iat * 1000)
      if (passwordUpdatedAt > tokenIssuedAt) {
        invalidateToken(res)
        return res
          .status(401)
          .json({ error: 'Password changed, please login again' })
      }
      req.user = {
        id: decoded.id,
        username: decoded.username,
      }
      next()
    })
  } catch (error) {
    return res
      .status(401)
      .json({ error: 'Token is not valid, Please login again', redirect: '/login' })
  }
}

const saveCookies = (res, token) => {
  try {
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: process.env.COOKIE_EXPIRES_IN * 1000 || 8 * 60 * 60 * 1000,
    })
  } catch (error) {
    console.error('save cookies error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error, Please try again' })
  }
}

const checkUserRole = async (req, res, next, roles) => {
  try {
    const id = req.user.id
    const user = await userModel.getUserById(id)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({ error: 'Access denied' })
    }

    next()
  } catch (error) {
    console.error('check user role error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error, Please try again' })
  }
}

const login = async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: 'Username and password are required' })
    }
    const result = await userModel.login(username, password)

    if (!result) {
      return res
        .status(400)
        .json({ error: 'Enter valid username and password' })
    }
    result.token = createToken(result.id, result.username)
    saveCookies(res, result.token)
    return res.status(200).json(result)
  } catch (error) {
    console.error('login error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error, Please try again' })
  }
}

const changePassword = async (req, res) => {
  try {
    const { username } = req.user
    const { oldPassword, newPassword } = req.body

    if (!oldPassword) {
      return res.status(400).json({ error: 'Old password is required' })
    }

    const loginRes = await userModel.login(username, oldPassword)

    if (loginRes == null) {
      return res.status(400).json({ error: 'Old password is incorrect' })
    }

    if (!newPassword || newPassword.length < 8) {
      return res
        .status(400)
        .json({ error: 'New password must be at least 8 characters' })
    }
    if (oldPassword === newPassword) {
      return res.status(400).json({ error: 'New password must be different' })
    }
    const result = await userModel.changePassword(
      username,
      oldPassword,
      newPassword,
    )
    if (result.error) {
      return res.status(400).json({ error: result.error })
    }

    return res.status(200).json(result)
  } catch (error) {
    console.error('change password error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error, Please try again' })
  }
}

// const getUserData = async (req, res) => {}

const updateUserRole = async (req, res) => {
  try {
    const { id, role } = req.body
    if (!id || !role || id <= 0) {
      return res.status(400).json({ error: 'User ID and role are required' })
    }
    const result = await userModel.updateUserRole(id, role)

    if (result.error) {
      return res.status(400).json({ error: result.error })
    }

    return res.status(200).json(result)
  } catch (error) {
    console.error('update user role error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error, Please try again' })
  }
}

const updateUserPhone = async (req, res) => {
  try {
    const { id, phone } = req.body

    if (!id || !phone || id <= 0 || !va.isValidPhoneNumber(phone)) {
      return res
        .status(400)
        .json({ error: 'Valid user ID and phone are required' })
    }
    const result = await userModel.updateUserPhone(id, phone)

    if (result.error) {
      return res.status(400).json({ error: result.error })
    }

    return res.status(200).json(result)
  } catch (error) {
    console.error('update user phone error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error, Please try again' })
  }
}

const deactivateUser = async (req, res) => {
  try {
    const { id } = req.body
    if (!id || id <= 0) {
      return res.status(400).json({ error: 'Valid user ID is required' })
    }
    const result = await userModel.deactivateUser(id)

    if (result.error) {
      return res.status(400).json({ error: result.error })
    }

    return res.status(200).json(result)
  } catch (error) {
    console.error('deactivate user error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error, Please try again' })
  }
}

const addUser = async (req, res) => {
  try {
    const { username, password, role, phone, fullName } = req.body

    if (!username || !password || !role || !phone || !fullName) {
      return res.status(400).json({ error: 'All fields are required' })
    }
    if (!va.isValidUsername(username) || !va.isValidPhoneNumber(phone)) {
      return res.status(400).json({ error: 'Invalid username or phone number' })
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: 'Password must be at least 8 characters' })
    }
    const result = await userModel.addUser(
      username,
      password,
      role,
      phone,
      fullName,
    )

    if (result.error) {
      return res.status(400).json({ error: result.error })
    }

    return res.status(201).json(result)
  } catch (error) {
    console.error('add user error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error, Please try again' })
  }
}

const getUsersList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const isDeleted = req.query.isDeleted === 'true'
    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
      return res.status(400).json({ error: 'Invalid pagination parameters' })
    }
    if (limit > 100) {
      return res.status(400).json({ error: 'Limit cannot exceed 100' })
    }
    const users = await userModel.getUsersList(page, limit, isDeleted)

    if (!users) {
      return res.status(404).json({ error: 'No users found' })
    }

    return res.status(200).json(users)
  } catch (error) {
    console.error('get users list error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error, Please try again' })
  }
}

module.exports = {
  login,
  verifyToken,
  saveCookies,
  checkUserRole,
  changePassword,
  // getUserData,
  updateUserRole,
  updateUserPhone,
  deactivateUser,
  addUser,
  getUsersList,
  logout,
}
