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

const getMemberRepertoireByGroupId = async (orchestraId, memberGroupId) => {
    const query = `
        SELECT pom.title, pom.composer, pomog.pdf_music_sheet_notes
        FROM piece_of_music pom
        LEFT JOIN orchestra o
          ON o.id = pom.id_orchestra
        LEFT JOIN piece_of_music_orchestra_group pomog
          ON pomog.id_piece_of_music = pom.id
        WHERE o.id = $1
          AND pomog.id_orchestra_group = $2;
    `
    const result = await pool.query(query, [orchestraId, memberGroupId])
    return result.rows
}

module.exports = {
    getMemberGroupByMemberId,
    getMemberRepertoireByGroupId,
}
