const pool = require('../config/database')

const getAllOrchestraOrchestraMember = async () => {
    const result = await pool.query('SELECT * FROM orchestra_orchestra_member')
    return result
}

const getOrchestraMemberByOrchestraIdAndMemberId = async (
    orchestraId,
    memberId
) => {
    const result = await pool.query(
        `SELECT * FROM orchestra_orchestra_member WHERE id_orchestra = $1 AND id_orchestra_member = $2`,
        [orchestraId, memberId]
    )
    return result.rows[0]
}

const addMemberToOrchestra = async (
    id_orchestra,
    id_orchestra_member,
    is_owner,
    is_manager
) => {
    const result = await pool.query(
        `INSERT INTO orchestra_orchestra_member (id_orchestra, id_orchestra_member, is_owner, is_manager) VALUES ($1, $2, $3, $4) RETURNING *`,
        [id_orchestra, id_orchestra_member, is_owner, is_manager]
    )
    return result.rows[0]
}

module.exports = {
    getAllOrchestraOrchestraMember,
    getOrchestraMemberByOrchestraIdAndMemberId,
    addMemberToOrchestra,
}
