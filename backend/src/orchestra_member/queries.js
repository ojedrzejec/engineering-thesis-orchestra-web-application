const getOrchestraMembers = 'SELECT * FROM orchestra_member'

const getOrchestraMemberById = 'SELECT * FROM orchestra_member WHERE id = $1'

const checkEmailExists = 'SELECT m FROM orchestra_member m WHERE m.email = $1' // m is an alias for orchestra member

const createOrchestraMember = `
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
`

const deleteOrchestraMemberById = 'DELETE FROM orchestra_member WHERE id = $1'

// const updateOrchestraMemberById = `
//     UPDATE orchestra_member
//     SET
//         first_name = $2,
//         last_name = $3,
//         phone = $4,
//         birth_date = $5,
//         are_you_student = $6,
//         university = $7,
//         profile_picture = $8,
//         description = $9
//     WHERE id = $1
//     RETURNING *;
// `

module.exports = {
    getOrchestraMembers,
    getOrchestraMemberById,
    checkEmailExists,
    createOrchestraMember,
    deleteOrchestraMemberById,
    // updateOrchestraMemberById,
}
