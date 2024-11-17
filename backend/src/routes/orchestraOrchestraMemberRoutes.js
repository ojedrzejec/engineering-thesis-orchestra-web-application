const { Router } = require('express')
const router = Router()
const {
    getOrchestrasWithMemberId,
    getAllOrchestraOrchestraMember,
} = require('../controllers/orchestraController')
const authMiddleware = require('../middlewares/authMiddleware')

router.get('/', authMiddleware.authenticateToken, getOrchestrasWithMemberId)
// router.get(
//     '/getAll',
//     authMiddleware.authenticateToken,
//     getAllOrchestraOrchestraMember
// )

module.exports = router
