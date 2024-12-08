const { Router } = require('express')
const router = Router()

const authMiddleware = require('../middlewares/authMiddleware')
const {
    getAllGroups,
    getAllGroupsWithMembers,
    getAllMembersNotInAnyGroup,
    createNewGroup,
    addMemberToGroup,
} = require('../controllers/groupController')

router.get('/:id', authMiddleware.authenticateToken, getAllGroups)
router.get(
    '/with-members/:id',
    authMiddleware.authenticateToken,
    getAllGroupsWithMembers
)
router.get(
    '/members-not-in-any-group/:id',
    authMiddleware.authenticateToken,
    getAllMembersNotInAnyGroup
)
router.post('/', authMiddleware.authenticateToken, createNewGroup)
router.post(
    '/assign-member',
    authMiddleware.authenticateToken,
    addMemberToGroup
)

module.exports = router
