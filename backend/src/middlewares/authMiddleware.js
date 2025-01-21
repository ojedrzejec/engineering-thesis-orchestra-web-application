require('dotenv').config()

const jwt = require('jsonwebtoken')

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_JWT_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ msg: 'authenticateToken: Forbidden' })
        }
        req.user = user
        next()
    })
}

module.exports = {
    authenticateToken,
}
