const { Router } = require('express')
const router = Router()
const {
    getOrchestrasWithMemberId,
    getAllOrchestraOrchestraMember,
    addMemberToOrchestra,
    updateMemberAsManager,
} = require('../controllers/orchestraController')
const authMiddleware = require('../middlewares/authMiddleware')

router.get('/', authMiddleware.authenticateToken, getOrchestrasWithMemberId)
router.get(
    '/getAll',
    authMiddleware.authenticateToken,
    getAllOrchestraOrchestraMember
)
router.post('/', authMiddleware.authenticateToken, addMemberToOrchestra)
router.patch('/', authMiddleware.authenticateToken, updateMemberAsManager)

module.exports = router
