const { Router } = require('express')
const router = Router()

const authMiddleware = require('../middlewares/authMiddleware')
const {
    getAllGroups,
    createNewGroup,
} = require('../controllers/groupController')

router.get('/:id', authMiddleware.authenticateToken, getAllGroups)
router.post('/', authMiddleware.authenticateToken, createNewGroup)

module.exports = router
