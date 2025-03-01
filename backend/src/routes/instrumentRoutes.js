const { Router } = require('express')
const router = Router()
const {
    getAllInstruments,
    getAllInstrumentsWithoutRepeatingTheirNames,
    getInstrumentsForUser,
    getAllByOrchestraId,
    updateAllInstrumentsNames,
    deleteInstrumentsByName,
    addInstrumentByOrchestraMemberId,
} = require('../controllers/instrumentController')
const authMiddleware = require('../middlewares/authMiddleware')

router.get('/', authMiddleware.authenticateToken, getAllInstruments)
router.get(
    '/distinctedNames',
    authMiddleware.authenticateToken,
    getAllInstrumentsWithoutRepeatingTheirNames
)
router.get(
    '/get-all-by-orchestra-id/:id',
    authMiddleware.authenticateToken,
    getAllByOrchestraId
)
router.get('/:id', authMiddleware.authenticateToken, getInstrumentsForUser)
router.put('/', authMiddleware.authenticateToken, updateAllInstrumentsNames)
router.delete('/', authMiddleware.authenticateToken, deleteInstrumentsByName)
router.post(
    '/:id',
    authMiddleware.authenticateToken,
    addInstrumentByOrchestraMemberId
)

module.exports = router
