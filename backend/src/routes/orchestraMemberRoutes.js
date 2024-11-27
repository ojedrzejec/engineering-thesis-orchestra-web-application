const { Router } = require('express')
const router = Router()
const {
    getAllOrchestraMembers,
    getAllOrchestraMembersEmailsNotAssignedToOrchestraByOrchestraId,
    getAllOrchestraMembersAssignedToOrchestraByOrchestraId,
    getOrchestraMember,
    getOrchestraMemberSingle,
    deleteOrchestraMember,
    patchOrchestraMember,
} = require('../controllers/orchestraMemberController')
const authMiddleware = require('../middlewares/authMiddleware')

router.get('/', authMiddleware.authenticateToken, getAllOrchestraMembers)
router.get(
    '/all-not-assigned-to-selected-orchestra/:id',
    authMiddleware.authenticateToken,
    getAllOrchestraMembersEmailsNotAssignedToOrchestraByOrchestraId
)
router.get(
    '/all-assigned-to-selected-orchestra/:id',
    authMiddleware.authenticateToken,
    getAllOrchestraMembersAssignedToOrchestraByOrchestraId
)
// router.get('/:id', authMiddleware.authenticateToken, getOrchestraMember)
router.get(
    '/single',
    authMiddleware.authenticateToken,
    getOrchestraMemberSingle
)
router.delete('/:id', authMiddleware.authenticateToken, deleteOrchestraMember)
router.patch('/', authMiddleware.authenticateToken, patchOrchestraMember)

module.exports = router
