const { Router } = require('express')
const router = Router()
const authMiddleware = require('../middlewares/authMiddleware')
const {
    getMemberGroup,
    getMemberRepertoire,
    getOrchestraRepertoire,
    getOrchestraPiecesOfMusic,
    createPieceOfMusic,
    addMusicSheetNotes,
} = require('../controllers/repertoireController')

router.get('/member-group/', authMiddleware.authenticateToken, getMemberGroup)
router.get(
    '/member-group/:id/',
    authMiddleware.authenticateToken,
    getMemberRepertoire
)

router.get('/:id/', authMiddleware.authenticateToken, getOrchestraRepertoire)
router.get(
    '/pieces-of-music/:id/',
    authMiddleware.authenticateToken,
    getOrchestraPiecesOfMusic
)
router.post('/', authMiddleware.authenticateToken, createPieceOfMusic)
router.post('/add-pdf/', authMiddleware.authenticateToken, addMusicSheetNotes)

module.exports = router
