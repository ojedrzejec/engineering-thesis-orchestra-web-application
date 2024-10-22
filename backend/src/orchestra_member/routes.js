const { Router } = require('express')
const controller = require('./controller')
const {
    authenticateToken,
    authorizeForOrchestra,
} = require('../../src/middlewares/authMiddleware')

const router = Router()

// Only managers and conductors can view all members within a specific orchestra
router.get(
    '/:orchestraId/members',
    // authenticateToken,
    // authorizeForOrchestra(req.params.orchestraId, 'manager'),
    controller.getOrchestraMembers
)

// Players can view their own profile, managers and conductors can view any
router.get(
    '/:orchestraId/members/:id',
    authenticateToken,
    // authorizeForOrchestra(req.params.orchestraId, 'player'),
    controller.getOrchestraMemberById
)
// // Players can view their own profile, managers and conductors can view any, and guests can see manager/owner info
// router.get(
//     '/:orchestraId/members/:id',
//     authenticateToken,
//     authorizeForOrchestraOrGuest(req.params.orchestraId, 'player'),
//     controller.getOrchestraMemberById
// )

// Registration does not require authentication
router.post('/', controller.addOrchestraMember)

// Login does not require authentication
router.post('/login', controller.loginOrchestraMember)

// Only conductors can remove members
router.delete(
    '/:orchestraId/members/:id',
    authenticateToken,
    // authorizeForOrchestra(req.params.orchestraId, 'conductor'),
    controller.removeOrchestraMemberById
)

// Managers and conductors can update member details
router.patch(
    '/:orchestraId/members/:id',
    authenticateToken,
    // authorizeForOrchestra(req.params.orchestraId, 'manager'),
    controller.updateOrchestraMemberById
)

module.exports = router
