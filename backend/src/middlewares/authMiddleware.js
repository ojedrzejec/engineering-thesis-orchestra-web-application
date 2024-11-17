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

// const authenticateToken = (req, res, next) => {
//     const token = req.header('Authorization')

//     if (!token || !token.startsWith('Bearer ')) {
//         return res.status(401).json({ msg: 'No token, authorization denied' })
//     }

//     try {
//         // Remove "Bearer " prefix from the token string
//         const actualToken = token.split(' ')[1]

//         // Verify token
//         const decoded = jwt.verify(
//             actualToken,
//             process.env.ACCESS_JWT_TOKEN_SECRET
//         )
//         req.user = decoded // Add user information to request object

//         next() // Proceed to the next middleware/route handler
//     } catch (err) {
//         res.status(401).json({ msg: 'Token is not valid' })
//     }
// }

module.exports = {
    authenticateToken,
}
