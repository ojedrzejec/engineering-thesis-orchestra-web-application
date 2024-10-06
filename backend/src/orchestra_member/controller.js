const { v4: uuidv4 } = require('uuid')
const pool = require('../../config/database')
const queries = require('./queries')

const getOrchestraMembers = (req, res) => {
    console.log('getOrchestraMembers')
    pool.query(queries.getOrchestraMembers, (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
}

const getOrchestraMemberById = (req, res) => {
    const id = req.params.id
    console.log('getOrchestraMemberById')
    pool.query(queries.getOrchestraMemberById, [id], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
}

const addOrchestraMember = (req, res) => {
    const id = uuidv4() // Generate a new UUID
    const {
        email,
        password,
        first_name,
        last_name,
        phone,
        birth_date,
        are_you_student,
        university,
        profile_picture,
        description,
    } = req.body
    console.log('addOrchestraMember')
    // check if the email exists in the database
    pool.query(queries.checkEmailExists, [email], (error, results) => {
        // if (error) {
        //     return res.status(500).send("An error occurred while checking the email.");
        // }
        if (error) {
            throw error
        }

        if (results.rows.length > 0) {
            return res.status(400).send('Email already exists.')
        }

        // if the email does not exist, add the orchestra member
        pool.query(
            queries.createOrchestraMember,
            [
                id,
                email,
                password,
                first_name,
                last_name,
                phone,
                birth_date,
                are_you_student,
                university,
                profile_picture,
                description,
            ],
            (error, results) => {
                // if (error) {
                //     return res.status(500).send("An error occurred while adding the orchestra member.");
                // }
                if (error) {
                    throw error
                }
                res.status(201).send('Orchestra member added successfully!')
                console.log('Orchestra Member created')
            }
        )
    })
}

module.exports = {
    getOrchestraMembers,
    getOrchestraMemberById,
    addOrchestraMember,
}
