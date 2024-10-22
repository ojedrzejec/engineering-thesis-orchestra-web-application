const getOrchestraMembers = `SELECT * FROM orchestra_member`

const getOrchestraMemberById = `SELECT * FROM orchestra_member WHERE id = $1`

const checkEmailExists = `SELECT m FROM orchestra_member m WHERE m.email = $1` // m is an alias for orchestra member

const getMemberOrchestrasAndRoles = `
    SELECT id_orchestra, is_owner, is_manager 
    FROM orchestra_orchestra_member 
    WHERE id_orchestra_member = $1
`

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

const deleteOrchestraMemberById = `DELETE FROM orchestra_member WHERE id = $1`

module.exports = {
    getOrchestraMembers,
    getOrchestraMemberById,
    checkEmailExists,
    getMemberOrchestrasAndRoles,
    createOrchestraMember,
    deleteOrchestraMemberById,
}
