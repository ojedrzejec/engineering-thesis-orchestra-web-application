const { Router } = require('express')
const controller = require('./controller')

const router = Router()

router.get('/', controller.getOrchestraMembers)
router.get('/:id', controller.getOrchestraMemberById)
router.post('/', controller.addOrchestraMember)
router.delete('/:id', controller.removeOrchestraMemberById)
// router.put('/:id', controller.updateOrchestraMember);

module.exports = router
