const { Router } = require('express');
const controller = require('./controller');

const router = Router();

router.get('/', controller.getOrchestraMembers);
router.get('/:id', controller.getOrchestraMemberById);
router.post('/', controller.addOrchestraMember);
// router.put('/:id', controller.updateOrchestraMember);
// router.delete('/:id', controller.deleteOrchestraMember);

module.exports = router;
