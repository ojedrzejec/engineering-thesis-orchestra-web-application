const { Router } = require('express')
const router = Router()
const { login, register } = require('../controllers/authController')

router.post('/login', login)
router.post('/register', register)

module.exports = router
