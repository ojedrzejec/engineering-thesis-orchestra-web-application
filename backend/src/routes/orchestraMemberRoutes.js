const { Router } = require('express')
const router = Router()
const {
    getAllOrchestraMembers,
    getAllOrchestraMembersIdsAndEmailsNotAssignedToOrchestraByOrchestraId,
    getAllOrchestraMembersAssignedToOrchestraByOrchestraId,
    getOrchestraMember,
    getAllOrchestraManagersByOrchestraId,
    getAllOrchestraPlayersByOrchestraId,
    getOrchestraMemberSingle,
    deleteOrchestraMember,
    patchOrchestraMember,
} = require('../controllers/orchestraMemberController')
const authMiddleware = require('../middlewares/authMiddleware')

router.get('/', authMiddleware.authenticateToken, getAllOrchestraMembers)
router.get(
    '/all-app-users-not-in-orchestra/:id',
    authMiddleware.authenticateToken,
    getAllOrchestraMembersIdsAndEmailsNotAssignedToOrchestraByOrchestraId
)
router.get(
    '/all-orchestra-members/:id',
    authMiddleware.authenticateToken,
    getAllOrchestraMembersAssignedToOrchestraByOrchestraId
)
// router.get('/:id', authMiddleware.authenticateToken, getOrchestraMember)
router.get(
    '/single',
    authMiddleware.authenticateToken,
    getOrchestraMemberSingle
)
router.get(
    '/orchestra-managers/:id',
    authMiddleware.authenticateToken,
    getAllOrchestraManagersByOrchestraId
)
router.get(
    '/orchestra-players/:id',
    authMiddleware.authenticateToken,
    getAllOrchestraPlayersByOrchestraId
)
router.delete('/:id', authMiddleware.authenticateToken, deleteOrchestraMember)
router.patch('/', authMiddleware.authenticateToken, patchOrchestraMember)

module.exports = router
