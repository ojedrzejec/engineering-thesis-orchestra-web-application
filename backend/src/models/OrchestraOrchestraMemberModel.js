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

const updateMemberAsManager = async (
    orchestraId,
    orchestraMemberId,
    isManager
) => {
    try {
        const result = await pool.query(
            `UPDATE orchestra_orchestra_member
            SET is_owner = false, is_manager = $3
            WHERE id_orchestra = $1 AND id_orchestra_member = $2
            RETURNING *;`,
            [orchestraId, orchestraMemberId, isManager]
        )
        return result.rows[0]
    } catch (err) {
        console.error(
            'Error updating orchestra member manager access type:',
            err
        )
        throw new Error('Error updating orchestra member manager access type')
    }
}

module.exports = {
    getAllOrchestraOrchestraMember,
    getOrchestraMemberByOrchestraIdAndMemberId,
    addMemberToOrchestra,
    updateMemberAsManager,
}
