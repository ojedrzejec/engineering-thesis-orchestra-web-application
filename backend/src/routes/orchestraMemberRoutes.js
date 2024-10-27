const { Router } = require('express')
const router = Router()
const {
    getAllOrchestraMembers,
    getOrchestraMember,
    deleteOrchestraMember,
} = require('../controllers/orchestraMemberController')
const authMiddleware = require('../middlewares/authMiddleware')

router.get('/', authMiddleware.authenticateToken, getAllOrchestraMembers)
router.get('/:id', authMiddleware.authenticateToken, getOrchestraMember)
router.delete('/:id', authMiddleware.authenticateToken, deleteOrchestraMember)
// router.patch('/:id', authMiddleware.authenticateToken, patchOrchestraMemberById)

module.exports = router
