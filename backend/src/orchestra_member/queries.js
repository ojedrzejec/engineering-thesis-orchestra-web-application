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

module.exports = {
    getOrchestraMembers,
    getOrchestraMemberById,
    checkEmailExists,
    createOrchestraMember,
    // updateOrchestraMemberById,
    // deleteOrchestraMemberById,
}
