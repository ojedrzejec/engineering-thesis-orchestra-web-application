const { Router } = require('express')
const router = Router()
const {
    getAllOrchestras,
    createOrchestra,
} = require('../controllers/orchestraController')
const authMiddleware = require('../middlewares/authMiddleware')

router.get('/', authMiddleware.authenticateToken, getAllOrchestras)
router.post('/', authMiddleware.authenticateToken, createOrchestra)

module.exports = router
