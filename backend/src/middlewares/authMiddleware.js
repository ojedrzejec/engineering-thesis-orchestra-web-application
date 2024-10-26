require('dotenv').config()

const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_JWT_TOKEN_SECRET, (err, user) => {
        if (err)
            return res.status(403).json({ msg: 'authenticateToken: Forbidden' })
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
//         const decoded = jwt.verify(actualToken, process.env.JWT_SECRET)
//         req.user = decoded // Add user information to request object

//         next() // Proceed to the next middleware/route handler
//     } catch (err) {
//         res.status(401).json({ msg: 'Token is not valid' })
//     }
// }

const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ msg: 'authorizeRole: Forbidden' })
        }
        next()
    }
}

// checkRoleForOrchestra = (orchestraId, role) => {
//     return (req, res, next) => {
//         const userRole = req.user.roles.find(
//             (r) => r.orchestraId === orchestraId
//         )
//         if (!userRole || userRole.role !== role) {
//             return res
//                 .status(403)
//                 .json({ msg: 'Access denied for this orchestra' })
//         }
//         next()
//     }
// }

// {
//     "id": "user-uuid",
//     "roles": [
//         { "role": "player", "orchestraId": "orch-uuid-1" },
//         { "role": "manager", "orchestraId": "orch-uuid-2" },
//         { "role": "owner", "orchestraId": "orch-uuid-3" }
//     ]
// }

module.exports = {
    authenticateToken,
    authorizeRole,
    // checkRoleForOrchestra,
}
