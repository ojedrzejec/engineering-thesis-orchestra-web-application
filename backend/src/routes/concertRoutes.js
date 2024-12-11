const { Router } = require('express')
const router = Router()

const authMiddleware = require('../middlewares/authMiddleware')

const {
    getAllConcerts,
    createConcert,
    createOrUpdateMemberAvailability,
    // updateConcert,
} = require('../controllers/concertController')

router.get('/:id', authMiddleware.authenticateToken, getAllConcerts)
router.post('/', authMiddleware.authenticateToken, createConcert)
router.put(
    '/',
    authMiddleware.authenticateToken,
    createOrUpdateMemberAvailability
)
// router.patch('/', authMiddleware.authenticateToken, updateConcert)

module.exports = router
