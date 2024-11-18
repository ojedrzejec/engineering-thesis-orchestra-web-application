const { Router } = require('express')
const router = Router()
const {
    getAllOrchestras,
    getOrchestra,
    createOrchestra,
} = require('../controllers/orchestraController')
const authMiddleware = require('../middlewares/authMiddleware')

router.get('/', authMiddleware.authenticateToken, getAllOrchestras)
router.get('/:id', authMiddleware.authenticateToken, getOrchestra)
router.post('/', authMiddleware.authenticateToken, createOrchestra)

module.exports = router
