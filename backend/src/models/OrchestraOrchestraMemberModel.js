const pool = require('../config/database')

const getAllOrchestraOrchestraMember = async () => {
    const result = await pool.query('SELECT * FROM orchestra_orchestra_member')
    return result
}

module.exports = {
    getAllOrchestraOrchestraMember,
}
