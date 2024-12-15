const pool = require('../config/database')

const getMemberGroupByMemberId = async (memberId) => {
    const query = `
     
        SELECT og.id, og.name
        FROM orchestra_group og
        JOIN orchestra_group_orchestra_member ogom 
          ON og.id = ogom.id_orchestra_group
        WHERE ogom.id_orchestra_member = $1
    `
    const result = await pool.query(query, [memberId])
    return result.rows[0]
}

module.exports = {
    getMemberGroupByMemberId,
}
