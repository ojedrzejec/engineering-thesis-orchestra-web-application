require('dotenv').config()

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const OrchestraMember = require('../models/OrchestraMemberModel')

// Handle orchestra member login
const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await OrchestraMember.findByEmail(email)
        if (!user) {
            return res.status(400).json({ msg: 'User not found' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' })
        }

        // Generate JWT token with user's ID and associated role
        const accessToken = generateJsonWebToken(user.id, 'player') // Default role to 'player'

        res.json({ accessToken: accessToken })
    } catch (err) {
        res.status(500).json({ msg: 'Server error' })
    }
}

const generateJsonWebToken = (userId, userRole) => {
    return jwt.sign(
        { id: userId, role: userRole }, // Default role to 'player'
        process.env.ACCESS_JWT_TOKEN_SECRET,
        { expiresIn: '30m' }
    )
}

const updateJsonWebToken = (userId, userRole, orchestraId) => {
    return jwt.sign(
        { id: userId, role: userRole, orchestraId }, // For roles: 'owner' and 'manager'
        process.env.ACCESS_JWT_TOKEN_SECRET,
        { expiresIn: '30m' }
    )
}

module.exports = {
    login,
    updateJsonWebToken,
}
