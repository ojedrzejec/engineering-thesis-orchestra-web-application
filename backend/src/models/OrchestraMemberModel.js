const pool = require('../config/database')

const findByEmail = async (email) => {
    const result = await pool.query(
        'SELECT * FROM orchestra_member WHERE email = $1',
        [email]
    )
    return result.rows[0]
}

const createOrchestraMember = async (userData) => {
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
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `,
        [
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
    createOrchestraMember,
}
