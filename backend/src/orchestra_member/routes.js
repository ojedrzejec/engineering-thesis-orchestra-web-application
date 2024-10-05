const { Router } = require('express');
const controller = require('./controller');

const router = Router();

router.get('/', controller.getOrchestraMembers);
router.get('/:id', controller.getOrchestraMemberById);

module.exports = router;
