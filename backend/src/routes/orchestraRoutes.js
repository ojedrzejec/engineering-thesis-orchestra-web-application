const { Router } = require('express')
const router = Router()
const {
    getAllOrchestras,
    getOrchestra,
    createOrchestra,
    updateOrchestra,
} = require('../controllers/orchestraController')
const authMiddleware = require('../middlewares/authMiddleware')

router.get('/', authMiddleware.authenticateToken, getAllOrchestras)
router.get('/:id', authMiddleware.authenticateToken, getOrchestra)
router.post('/', authMiddleware.authenticateToken, createOrchestra)
router.patch('/', authMiddleware.authenticateToken, updateOrchestra)

module.exports = router
