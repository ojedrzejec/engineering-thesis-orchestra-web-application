require('dotenv').config()

const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../config/database')
const queries = require('./queries')

const getOrchestraMembers = (req, res) => {
    console.log('getOrchestraMembers')
    pool.query(queries.getOrchestraMembers, (error, results) => {
        if (error) {
            return res
                .status(500)
                .send('An error occurred while getting orchestra members.')
        }
        if (!results.rows.length) {
            return res.status(404).send('No orchestra members found.')
        }
        res.status(200).json(results.rows)
    })
}

const getOrchestraMemberById = (req, res) => {
    const id = req.params.id
    console.log('getOrchestraMemberById')
    pool.query(queries.getOrchestraMemberById, [id], (error, results) => {
        if (error) {
            return res
                .status(500)
                .send(
                    'An error occurred while getting the orchestra member by id.'
                )
        }
        if (!results.rows.length) {
            return res.status(404).send('Orchestra member not found.')
        }
        res.status(200).json(results.rows)
    })
}

const addOrchestraMember = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        // console.log(salt)
        // console.log(hashedPassword)

        const orchestraMember = {
            email: req.body.email,
            password: hashedPassword,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            phone: req.body.phone,
            birth_date: req.body.birth_date,
            are_you_student: req.body.are_you_student,
            university: req.body.university,
            profile_picture: req.body.profile_picture,
            description: req.body.description,
        }
        console.log('addOrchestraMember')

        // check if the email exists in the database
        pool.query(
            queries.checkEmailExists,
            [orchestraMember.email],
            (error, results) => {
                if (error) {
                    return res
                        .status(500)
                        .send(
                            'An error occurred while checking if the email exists in the database, cannot add new orchestra member.'
                        )
                }

                if (results.rows.length > 0) {
                    return res
                        .status(400)
                        .send(
                            'Email already exists, cannot add new orchestra member.'
                        )
                }

                // if the email does not exist, add the orchestra member
                const id = uuidv4() // Generate a new UUID
                pool.query(
                    queries.createOrchestraMember,
                    [
                        id,
                        orchestraMember.email,
                        orchestraMember.password,
                        orchestraMember.first_name,
                        orchestraMember.last_name,
                        orchestraMember.phone,
                        orchestraMember.birth_date,
                        orchestraMember.are_you_student,
                        orchestraMember.university,
                        orchestraMember.profile_picture,
                        orchestraMember.description,
                    ],
                    (error, results) => {
                        if (error) {
                            return res
                                .status(500)
                                .send(
                                    'An error occurred while adding the orchestra member.'
                                )
                        }
                        res.status(201).send(
                            'Orchestra member added successfully!'
                        )
                    }
                )
            }
        )
    } catch {
        res.status(500).send(
            'An error occurred while registering the orchestra member.'
        )
    }
}

const loginOrchestraMember = (req, res) => {
    console.log('loginOrchestraMember')
    const { email, password } = req.body

    // Check if the email exists in the database
    pool.query(queries.checkEmailExists, [email], async (error, results) => {
        if (error) {
            return res
                .status(500)
                .send(
                    'An error occurred while checking if the email exists in the database, cannot login orchestra member.'
                )
        }

        if (!results.rows.length) {
            return res
                .status(400)
                .send(
                    'Email does not exist in the database, cannot login orchestra member.'
                )
        }

        try {
            const userRow = results.rows[0].m
            const userArray = userRow.match(/\(([^)]+)\)/)[1].split(',')
            const userId = userArray[0].replace(/"/g, '')
            const userEmail = userArray[1].replace(/"/g, '')
            const userPassword = userArray[2].replace(/"/g, '')

            // Verify password
            if (await bcrypt.compare(password, userPassword)) {
                // Fetch all orchestras and roles for the member
                pool.query(
                    queries.getMemberOrchestrasAndRoles,
                    [userId],
                    (error, roleResults) => {
                        if (error) {
                            return res
                                .status(500)
                                .send(
                                    'An error occurred while retrieving orchestra roles.'
                                )
                        }

                        const orchestras = roleResults.rows.map((row) => ({
                            orchestraId: row.id_orchestra,
                            isOwner: row.is_owner,
                            isManager: row.is_manager,
                        }))

                        // Generate JWT token with user's ID and associated orchestras
                        const accessToken = generateJsonWebToken(
                            userId,
                            userEmail,
                            orchestras
                        )

                        const refreshToken = jwt.sign(
                            { userId, email, orchestras },
                            process.env.REFRESH_JWT_TOKEN_SECRET
                        )

                        return res.json({
                            accessToken: accessToken,
                            refreshToken: refreshToken,
                        })
                    }
                )
            } else {
                return res.status(403).send('Invalid credentials.')
            }
        } catch (err) {
            return res.status(500).send('An error occurred while logging in.')
        }
    })
}

const generateJsonWebToken = (memberId, email, orchestras) => {
    return jwt.sign(
        { memberId, email, orchestras },
        process.env.ACCESS_JWT_TOKEN_SECRET,
        { expiresIn: '15m' }
    )
}

const removeOrchestraMemberById = (req, res) => {
    const id = req.params.id
    console.log('removeOrchestraMemberById')

    // check if the orchestra member exists
    pool.query(queries.getOrchestraMemberById, [id], (error, results) => {
        if (error) {
            return res
                .status(500)
                .send(
                    'An error occurred while getting the orchestra member by id, cannot delete.'
                )
        }

        if (!results.rows.length) {
            return res
                .status(404)
                .send('Orchestra member not found, cannot delete.')
        }

        // if the specified orchestra member exists, delete it
        pool.query(
            queries.deleteOrchestraMemberById,
            [id],
            (error, results) => {
                if (error) {
                    return res
                        .status(500)
                        .send(
                            'An error occurred while deleting the orchestra member by id.'
                        )
                }
                res.status(200).send(
                    `Orchestra member with ID: \"${id}\" deleted successfully!`
                )
            }
        )
    })
}

const updateOrchestraMemberById = (req, res) => {
    const id = req.params.id
    const {
        // email,
        // password,
        first_name,
        last_name,
        phone,
        birth_date,
        are_you_student,
        university,
        profile_picture,
        description,
    } = req.body
    console.log('updateOrchestraMemberById, received ID:', id)

    // Check if the orchestra member exists
    pool.query(queries.getOrchestraMemberById, [id], (error, results) => {
        if (error) {
            console.error('Error fetching orchestra member by ID:', error)
            return res
                .status(500)
                .send(
                    'An error occurred while getting the orchestra member by id, cannot update.'
                )
        }
        if (!results.rows.length) {
            return res
                .status(404)
                .send('Orchestra member not found, cannot update.')
        }

        // Building the dynamic query
        const columnsToUpdate = []
        const values = []
        let counter = 1

        if (first_name) {
            columnsToUpdate.push(`first_name = $${counter++}`)
            values.push(first_name)
        }
        if (last_name) {
            columnsToUpdate.push(`last_name = $${counter++}`)
            values.push(last_name)
        }
        if (phone) {
            columnsToUpdate.push(`phone = $${counter++}`)
            values.push(phone)
        }
        if (birth_date) {
            columnsToUpdate.push(`birth_date = $${counter++}`)
            values.push(birth_date)
        }
        if (typeof are_you_student !== 'undefined') {
            columnsToUpdate.push(`are_you_student = $${counter++}`)
            values.push(are_you_student)
        }
        if (university) {
            columnsToUpdate.push(`university = $${counter++}`)
            values.push(university)
        }
        if (profile_picture) {
            columnsToUpdate.push(`profile_picture = $${counter++}`)
            values.push(profile_picture)
        }
        if (description) {
            columnsToUpdate.push(`description = $${counter++}`)
            values.push(description)
        }

        // If there are no columns to update, return a 400 Bad Request response
        if (columnsToUpdate.length === 0) {
            return res.status(400).send('No valid columns provided for update.')
        }

        // Add the id as the last value for the WHERE clause
        values.push(id)
        const updateQuery = `
            UPDATE orchestra_member
            SET ${columnsToUpdate.join(', ')}
            WHERE id = $${counter}
            RETURNING *;
        `

        // Execute the update query
        pool.query(updateQuery, values, (error, updateResults) => {
            if (error) {
                console.error('Error updating orchestra member by ID:', error)
                return res
                    .status(500)
                    .send(
                        'An error occurred while updating the orchestra member by id.'
                    )
            }
            res.status(200).send(
                `Orchestra member with ID: "${id}" updated successfully!`
            )
        })
    })
}

module.exports = {
    getOrchestraMembers,
    getOrchestraMemberById,
    addOrchestraMember,
    loginOrchestraMember,
    removeOrchestraMemberById,
    updateOrchestraMemberById,
}
