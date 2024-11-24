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
        instruments, // string array of instrument names
        phone,
        birth_date,
        are_you_student,
        university,
        profile_picture,
        description,
    } = req.body

    try {
        // Check if user already exists
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
        if (!createdOrchestraMember) {
            // throw new Error('Failed to create orchestra member')
            return res
                .status(500)
                .json({ msg: 'Failed to create orchestra member' })
        }

        const createdInstruments = []
        for (const instrument of instruments) {
            const createdInstrumentWithMember =
                await InstrumentModel.createInstrument(
                    createdOrchestraMember.id,
                    instrument
                )

            if (!createdInstrumentWithMember) {
                // throw new Error('Failed to create instrument with member')
                return res
                    .status(500)
                    .json({ msg: 'Failed to create instrument with member' })
            }
            createdInstruments.push(createdInstrumentWithMember)
        }

        res.json(createdOrchestraMember)
    } catch (err) {
        console.error('Error during registration:', err)
        res.status(500).json({ msg: 'Server error while registration.' })
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

        const token = generateJsonWebToken(user)

        res.json({ token })
    } catch (err) {
        console.error('Error during login:', err)
        res.status(500).json({ msg: 'Server error while logging in.' })
    }
}

const generateJsonWebToken = (user) => {
    // Generate JWT token with user's ID
    const payload = {
        id: user.id,
    }

    return jwt.sign(payload, process.env.ACCESS_JWT_TOKEN_SECRET, {
        expiresIn: '1h', // Token expires in 1 hour
    })
}

// const updateJsonWebToken = (userId) => {
//     return jwt.sign({ id: userId }, process.env.ACCESS_JWT_TOKEN_SECRET, {
//         expiresIn: '30m',
//     })
// }

module.exports = {
    register,
    login,
    // updateJsonWebToken,
}
