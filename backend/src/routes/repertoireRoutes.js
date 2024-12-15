const { Router } = require('express')
const router = Router()
const authMiddleware = require('../middlewares/authMiddleware')
const {
    getMemberGroup,
    getMemberRepertoire,
} = require('../controllers/repertoireController')

router.get('/member-group/', authMiddleware.authenticateToken, getMemberGroup)
router.get(
    '/member-group/:id',
    authMiddleware.authenticateToken,
    getMemberRepertoire
)
module.exports = router
