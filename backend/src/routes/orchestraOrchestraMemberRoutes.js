const { Router } = require('express')
const router = Router()
const {
    getOrchestrasWithMemberId,
    getAllOrchestraOrchestraMember,
    addMemberToOrchestra,
} = require('../controllers/orchestraController')
const authMiddleware = require('../middlewares/authMiddleware')

router.get('/', authMiddleware.authenticateToken, getOrchestrasWithMemberId)
router.get(
    '/getAll',
    authMiddleware.authenticateToken,
    getAllOrchestraOrchestraMember
)
router.post('/', authMiddleware.authenticateToken, addMemberToOrchestra)

module.exports = router
