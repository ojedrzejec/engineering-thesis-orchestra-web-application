const pool = require('../config/database')
const { v4: uuidv4 } = require('uuid')

const findPieceOfMusicById = async (id) => {
    const query = `
        SELECT *
        FROM piece_of_music
        WHERE id = $1;
    `
    const result = await pool.query(query, [id])
    return result.rows[0]
}

const getMemberGroupByMemberId = async (memberId, orchestraId) => {
    const query = `
        SELECT og.id, og.name
        FROM orchestra_group og
        JOIN orchestra_group_orchestra_member ogom 
          ON og.id = ogom.id_orchestra_group
        WHERE ogom.id_orchestra_member = $1 AND og.id_orchestra = $2;
    `
    const result = await pool.query(query, [memberId, orchestraId])
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
          AND pomog.id_orchestra_group = $2
        ORDER BY pom.title, pom.composer;
    `
    const result = await pool.query(query, [orchestraId, memberGroupId])
    return result.rows
}

const getOrchestraRepertoireByOrchestraId = async (orchestraId) => {
    const query = `
        SELECT pom.*, pomog.pdf_music_sheet_notes, pomog.id_orchestra_group, og.name
        FROM piece_of_music pom
        LEFT JOIN piece_of_music_orchestra_group pomog 
          ON pom.id = pomog.id_piece_of_music
        LEFT JOIN orchestra_group og 
          ON og.id = pomog.id_orchestra_group
        WHERE pom.id_orchestra = $1
        ORDER BY pom.title, pom.composer, og.name;
    `
    const result = await pool.query(query, [orchestraId])
    return result.rows
}

const getOrchestraPiecesOfMusicByOrchestraId = async (orchestraId) => {
    const query = `
        SELECT *
        FROM piece_of_music
        WHERE id_orchestra = $1;
    `
    const result = await pool.query(query, [orchestraId])
    return result.rows
}

const createPieceOfMusic = async (orchestraId, title, composer) => {
    const query = `
        INSERT INTO piece_of_music (id, id_orchestra, title, composer)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `
    const id = uuidv4()
    const result = await pool.query(query, [id, orchestraId, title, composer])
    return result.rows[0]
}

const addMusicSheetNotes = async (pieceOfMusicId, pdf, groupId) => {
    const query = `
        INSERT INTO piece_of_music_orchestra_group (id_piece_of_music, id_orchestra_group, pdf_music_sheet_notes)
        VALUES ($1, $2, $3)
        RETURNING *;
    `
    const result = await pool.query(query, [pieceOfMusicId, groupId, pdf])
    return result.rows[0]
}

module.exports = {
    findPieceOfMusicById,
    getMemberGroupByMemberId,
    getMemberRepertoireByGroupId,
    getOrchestraRepertoireByOrchestraId,
    getOrchestraPiecesOfMusicByOrchestraId,
    createPieceOfMusic,
    addMusicSheetNotes,
}
