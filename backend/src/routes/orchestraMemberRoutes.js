const { Router } = require('express')
const router = Router()
const {
    getAllOrchestraMembers,
    getOrchestraMember,
    getOrchestraMemberSingle,
    deleteOrchestraMember,
    patchOrchestraMember,
} = require('../controllers/orchestraMemberController')
const authMiddleware = require('../middlewares/authMiddleware')

router.get('/', authMiddleware.authenticateToken, getAllOrchestraMembers)
// router.get('/:id', authMiddleware.authenticateToken, getOrchestraMember)
router.get(
    '/single',
    authMiddleware.authenticateToken,
    getOrchestraMemberSingle
)
router.delete('/:id', authMiddleware.authenticateToken, deleteOrchestraMember)
router.patch('/', authMiddleware.authenticateToken, patchOrchestraMember)

module.exports = router
