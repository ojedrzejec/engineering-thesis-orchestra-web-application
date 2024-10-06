const { v4: uuidv4 } = require('uuid')
const pool = require('../../config/database')
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
                .send('Email already exists, cannot add new orchestra member.')
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
                if (error) {
                    return res
                        .status(500)
                        .send(
                            'An error occurred while adding the orchestra member.'
                        )
                }
                res.status(201).send('Orchestra member added successfully!')
            }
        )
    })
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
    removeOrchestraMemberById,
    updateOrchestraMemberById,
}
