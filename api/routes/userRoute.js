const express = require('express')
const {
  login,
  changePassword,
  verifyToken,
  checkUserRole,
  updateUserRole,
  updateUserPhone,
  deactivateUser,
  addUser,
  getUsersList,
  // getUserData,
  logout,
} = require('../controller/userController')

const router = express.Router()

router.post('/login', login)
router.patch('/changePassword', verifyToken, changePassword)
router.patch(
  '/updateRole',
  verifyToken,
  (req, res, next) => checkUserRole(req, res, next, ['owner', 'admin']),
  updateUserRole,
)
router.patch(
  '/updatePhone',
  verifyToken,
  (req, res, next) => checkUserRole(req, res, next, ['owner', 'admin']),
  updateUserPhone,
)
router.patch(
  '/deactivate',
  verifyToken,
  (req, res, next) => checkUserRole(req, res, next, ['owner', 'admin']),
  deactivateUser,
)
router.post(
  '/add',
  verifyToken,
  (req, res, next) => checkUserRole(req, res, next, ['owner', 'admin']),
  addUser,
)
router.get(
  '/list',
  verifyToken,
  (req, res, next) => checkUserRole(req, res, next, ['owner', 'admin']),
  getUsersList,
)

// router.get('/user', verifyToken, (req, res, next) => checkUserRole(req, res, next, ['owner', 'admin']), getUserData)

router.get('/logout', verifyToken, logout)

module.exports = router