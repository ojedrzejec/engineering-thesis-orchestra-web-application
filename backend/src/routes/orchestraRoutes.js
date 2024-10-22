const { Router } = require('express')
const router = Router()
const { createOrchestra } = require('../controllers/orchestraController')
const authMiddleware = require('../middlewares/authMiddleware')

router.post('/create', authMiddleware.authenticateToken, createOrchestra)

module.exports = router
