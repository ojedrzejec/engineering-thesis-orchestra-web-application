const { Router } = require('express')
const router = Router()
const {
    getAllOrchestraMembers,
    getOrchestraMemberById,
} = require('../controllers/orchestraMemberController')
const authMiddleware = require('../middlewares/authMiddleware')

router.get('/', authMiddleware.authenticateToken, getAllOrchestraMembers)
router.get('/:id', authMiddleware.authenticateToken, getOrchestraMemberById)

module.exports = router
