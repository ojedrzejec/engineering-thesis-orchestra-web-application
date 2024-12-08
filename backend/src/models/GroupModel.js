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

const getGroupByName = async (name, orchestraId) => {
    const result = await pool.query(
        `SELECT * FROM orchestra_group WHERE name = $1 AND id_orchestra = $2`,
        [name, orchestraId]
    )
    return result.rows[0]
}

const getGroupById = async (groupId) => {
    const result = await pool.query(
        `SELECT * FROM orchestra_group WHERE id = $1`,
        [groupId]
    )
    return result.rows[0]
}

// get all members who are not assigned to any grouf in the particular orchestra by orchestra id
const getAllMembersNotInAnyGroup = async (orchestraId) => {
    const result = await pool.query(
        `SELECT id, email, first_name, last_name FROM orchestra_member om 
          JOIN orchestra_orchestra_member oom ON om.id = oom.id_orchestra_member 
          WHERE oom.id_orchestra = $1 
          AND om.id NOT IN (
              SELECT id_orchestra_member FROM orchestra_group_orchestra_member ogom 
              WHERE ogom.id_orchestra_group IN (
                  SELECT id FROM orchestra_group WHERE id_orchestra = $1
                )
            )`,
        [orchestraId]
    )
    return result.rows
}

const createGroup = async (name, orchestraId) => {
    const id = uuidv4() // Generate a new UUID

    const result = await pool.query(
        `INSERT INTO orchestra_group (id, id_orchestra, name) VALUES ($1, $2, $3) RETURNING *`,
        [id, orchestraId, name]
    )
    return result.rows[0]
}

module.exports = {
    getAllGroupsByOrchestraId,
    getAllMembersByGroupId,
    getGroupByName,
    getGroupById,
    getAllMembersNotInAnyGroup,
    createGroup,
}
