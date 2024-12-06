const pool = require('../config/database')
const { v4: uuidv4 } = require('uuid')

const getAllGroupsByOrchestraId = async (orchestraId) => {
    const result = await pool.query(
        `SELECT id, name FROM orchestra_group WHERE id_orchestra = $1`,
        [orchestraId]
    )
    return result.rows
}

module.exports = {
    getAllGroupsByOrchestraId,
}
