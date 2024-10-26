require('dotenv').config()

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const OrchestraMemberModel = require('../models/OrchestraMemberModel')
const InstrumentModel = require('../models/InstrumentModel')

// Handle orchestra member registration
const register = async (req, res) => {
    const {
        email,
        password,
        first_name,
        last_name,
        // instruments,
        phone,
        birth_date,
        are_you_student,
        university,
        profile_picture,
        description,
    } = req.body

    try {
        const user = await OrchestraMemberModel.findByEmail(email)
        if (user) {
            return res.status(400).json({ msg: 'User already exists' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newOrchestraMember = {
            email,
            password: hashedPassword,
            first_name,
            last_name,
            phone,
            birth_date,
            are_you_student,
            university,
            profile_picture,
            description,
        }

        const createdOrchestraMember =
            await OrchestraMemberModel.createOrchestraMember(newOrchestraMember)
        res.json(createdOrchestraMember)

        console.log(createdOrchestraMember)
        // console.log('instruments: ', instruments)

        // instruments.forEach(async (instrument) => {
        //     await InstrumentModel.addOrchestraMemberToInstrument(
        //         createdOrchestraMember.id,
        //         instrument // instrument name
        //     )
        // })
    } catch (err) {
        res.status(500).json({ msg: 'Server error' })
    }
}

// Handle orchestra member login
const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await OrchestraMemberModel.findByEmail(email)
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
    register,
    login,
    updateJsonWebToken,
}
