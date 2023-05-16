const express = require('express')
const router = express.Router()
const {get,getManager,getSelectEmployees, Assignment, displayLeaveRequests, grant, deleteTask, suggestions, getSelectedSuggestions} = require('../controllers/userController')
const {protect} = require('../middleware/authMiddleware')

router.get('/get', protect, getManager)
router.post('/assign',protect,getSelectEmployees)
router.post('/assignment', protect, Assignment)
router.post('/displayRequests', protect, displayLeaveRequests)
router.post('/grantRequest', protect, grant)
router.post('/deleteTask', protect, deleteTask)
router.post('/suggestions', protect, suggestions)
router.post('/gss', protect, getSelectedSuggestions)
router.post('/get', protect, get)

module.exports = router