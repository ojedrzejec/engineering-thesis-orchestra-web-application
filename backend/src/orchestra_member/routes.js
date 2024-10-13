const { Router } = require('express')
const controller = require('./controller')

const router = Router()

router.get('/', controller.getOrchestraMembers)
router.get('/:id', controller.getOrchestraMemberById)
router.post('/', controller.addOrchestraMember) // register
router.post('/login', controller.loginOrchestraMember) // login
router.delete('/:id', controller.removeOrchestraMemberById)
router.patch('/:id', controller.updateOrchestraMemberById) // update only the modified columns of the orchestra member

module.exports = router
