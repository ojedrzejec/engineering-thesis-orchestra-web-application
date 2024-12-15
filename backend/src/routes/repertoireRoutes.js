const { Router } = require('express')
const router = Router()
const authMiddleware = require('../middlewares/authMiddleware')
const {
    getMemberGroup,
} = require('../controllers/repertoireController')

router.get('/member-group/', authMiddleware.authenticateToken, getMemberGroup)
module.exports = router
