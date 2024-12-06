const { Router } = require('express')
const router = Router()

const authMiddleware = require('../middlewares/authMiddleware')
const { getAllGroups } = require('../controllers/groupController')

router.get('/:id', authMiddleware.authenticateToken, getAllGroups)

module.exports = router
