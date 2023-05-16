const express = require('express')
const router = express.Router()
const {protect} = require('../middleware/authMiddleware')
const {Match,} = require('../controllers/userController')

router.post('/match', protect, Match)

module.exports = router