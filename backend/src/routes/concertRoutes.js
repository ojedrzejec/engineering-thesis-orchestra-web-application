const { Router } = require('express')
const router = Router()

const authMiddleware = require('../middlewares/authMiddleware')

const {
    getAllConcerts,
    getMemberAvailabilityAllConcerts,
    getAllMembersAvailabilityAllConcertsInOrchestra,
    createConcert,
    createOrUpdateMemberAvailability,
    // updateConcert,
} = require('../controllers/concertController')

router.get('/:id', authMiddleware.authenticateToken, getAllConcerts)
router.get(
    '/member-availability/:id',
    authMiddleware.authenticateToken,
    getMemberAvailabilityAllConcerts
)
router.get(
    '/all-members-availability/:id',
    authMiddleware.authenticateToken,
    getAllMembersAvailabilityAllConcertsInOrchestra
)
router.post('/', authMiddleware.authenticateToken, createConcert)
router.put(
    '/',
    authMiddleware.authenticateToken,
    createOrUpdateMemberAvailability
)
// router.patch('/', authMiddleware.authenticateToken, updateConcert)

module.exports = router
