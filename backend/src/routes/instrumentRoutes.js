const { Router } = require('express')
const router = Router()
const {
    getAllInstruments,
    getAllInstrumentsWithoutRepeatingTheirNames,
    getInstrumentsForUser,
    updateAllInstrumentsNames,
    deleteInstrumentsByName,
    addInstrumentWithoutMember,
    addInstrumentWithMember,
    // deleteInstrumentsByOrchestraMemberId,
    // updateUserInstruments,
    // patchUserInstruments,
} = require('../controllers/instrumentController')
const authMiddleware = require('../middlewares/authMiddleware')

router.get('/', authMiddleware.authenticateToken, getAllInstruments)
router.get(
    '/distinctedNames',
    authMiddleware.authenticateToken,
    getAllInstrumentsWithoutRepeatingTheirNames
)
router.get('/:id', authMiddleware.authenticateToken, getInstrumentsForUser)
router.put('/', authMiddleware.authenticateToken, updateAllInstrumentsNames)
router.delete('/', authMiddleware.authenticateToken, deleteInstrumentsByName)
router.post('/', authMiddleware.authenticateToken, addInstrumentWithoutMember)
router.post('/:id', authMiddleware.authenticateToken, addInstrumentWithMember)
// router.delete(
//     '/:id',
//     authMiddleware.authenticateToken,
//     deleteInstrumentsByOrchestraMemberId
// )
// router.put('/:id', authMiddleware.authenticateToken, updateUserInstruments)
// router.patch('/:id', authMiddleware.authenticateToken, patchUserInstruments)

module.exports = router
