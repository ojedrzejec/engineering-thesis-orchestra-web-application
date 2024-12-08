const { Router } = require('express')
const router = Router()

const authMiddleware = require('../middlewares/authMiddleware')
const {
    getAllGroups,
    getAllGroupsWithMembers,
    createNewGroup,
} = require('../controllers/groupController')

router.get('/:id', authMiddleware.authenticateToken, getAllGroups)
router.get(
    '/with-members/:id',
    authMiddleware.authenticateToken,
    getAllGroupsWithMembers
)
router.post('/', authMiddleware.authenticateToken, createNewGroup)

module.exports = router
