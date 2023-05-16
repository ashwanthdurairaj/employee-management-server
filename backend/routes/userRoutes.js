const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  getMe,
  getEmployee,
  getTasks,
  registerLeave,
  registerMessage,
  fetchMessage,
  getSelectTasks,
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)
router.get('/get', protect, getEmployee)
router.post('/tasks', protect, getTasks)
router.post('/leave', protect, registerLeave)
router.post('/message', protect, registerMessage)
router.post('/fetchmessage', protect, fetchMessage)
router.post('/tasklist', protect, getSelectTasks)
module.exports = router
