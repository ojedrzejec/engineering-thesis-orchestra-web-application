const pool = require('../config/database')
const { v4: uuidv4 } = require('uuid')

const findByEmail = async (email) => {
    const result = await pool.query(
        'SELECT * FROM orchestra_member WHERE email = $1',
        [email]
    )
    return result.rows[0]
}

const findById = async (id) => {
    const result = await pool.query(
        'SELECT * FROM orchestra_member WHERE id = $1',
        [id]
    )
    return result.rows[0]
}

const getAllOrchestraMembers = async () => {
    const result = await pool.query('SELECT * FROM orchestra_member')
    return result.rows
}

const getOrchestraMemberById = async (id) => {
    const result = await pool.query(
        'SELECT * FROM orchestra_member WHERE id = $1',
        [id]
    )
    return result.rows[0]
}

const deleteOrchestraMemberById = async (id) => {
    const result = await pool.query(
        'DELETE FROM orchestra_member WHERE id = $1 RETURNING *',
        [id]
    )
    return result.rows[0]
}

const updateOrchestraMemberById = async (id, fields) => {
    const {
        first_name,
        last_name,
        phone,
        birth_date,
        are_you_student,
        university,
        profile_picture,
        description,
    } = fields

    // COALESCE() function to return the first non-null argument
    const result = await pool.query(
        `UPDATE orchestra_member
         SET first_name = COALESCE($1, first_name),
             last_name = COALESCE($2, last_name),
             phone = COALESCE($3, phone),
             birth_date = COALESCE($4, birth_date),
             are_you_student = COALESCE($5, are_you_student),
             university = COALESCE($6, university),
             profile_picture = $7, -- Directly set profile_picture to allow null values
             description = COALESCE($8, description)
         WHERE id = $9
         RETURNING *;`,
        [
            first_name,
            last_name,
            phone,
            birth_date,
            are_you_student,
            university,
            profile_picture, // Allow null values
            description,
            id,
        ]
    )

    return result.rows[0]
}

const createOrchestraMember = async (userData) => {
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
    } = userData
    const result = await pool.query(
        `
      INSERT INTO orchestra_member (
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
        description
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;
    `,
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
        ]
    )
    return result.rows[0]
}

module.exports = {
    findByEmail,
    findById,
    getAllOrchestraMembers,
    getOrchestraMemberById,
    deleteOrchestraMemberById,
    updateOrchestraMemberById,
    createOrchestraMember,
}
