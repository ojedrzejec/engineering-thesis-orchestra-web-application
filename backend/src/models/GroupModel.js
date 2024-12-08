const pool = require('../config/database')
const { v4: uuidv4 } = require('uuid')

const getAllGroupsByOrchestraId = async (orchestraId) => {
    const result = await pool.query(
        `SELECT id, name FROM orchestra_group WHERE id_orchestra = $1`,
        [orchestraId]
    )
    return result.rows
}

const getAllMembersByGroupId = async (groupId) => {
    const result = await pool.query(
        `SELECT id, email, first_name, last_name FROM orchestra_member WHERE id IN (SELECT id_orchestra_member FROM orchestra_group_orchestra_member WHERE id_orchestra_group = $1)`,
        [groupId]
    )
    return result.rows
}

const getGroupByName = async (name) => {
    const result = await pool.query(
        `SELECT * FROM orchestra_group WHERE name = $1`,
        [name]
    )
    return result.rows[0]
}
const createGroup = async (name, orchestraId) => {
    const id = uuidv4() // Generate a new UUID

    const result = await pool.query(
        `INSERT INTO orchestra_group (id, id_orchestra, name) VALUES ($1, $2, $3) RETURNING *`,
        [id, orchestraId, name]
    )
}

module.exports = {
    getAllGroupsByOrchestraId,
    getAllMembersByGroupId,
    getGroupByName,
    createGroup,
}
