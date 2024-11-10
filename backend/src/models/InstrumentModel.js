const pool = require('../config/database')
const { v4: uuidv4 } = require('uuid')

const findByName = async (name) => {
    const result = await pool.query(
        'SELECT * FROM instrument WHERE name = $1',
        [name]
    )
    return result.rows[0]
}

const getAllInstruments = async () => {
    const result = await pool.query('SELECT * FROM instrument')
    return result.rows
}

// get all instruments but do not repeat the same instrument if there are few instruments with the same name
const getAllInstrumentsDistincted = async () => {
    const result = await pool.query('SELECT DISTINCT name FROM instrument')
    return result.rows
}

// Get all instruments associated with the specified orchestra member
const getInstrumentsByMemberId = async (orchestraMemberId) => {
    const result = await pool.query(
        'SELECT * FROM instrument WHERE id_orchestra_member = $1',
        [orchestraMemberId]
    )
    return result.rows
}

// Update all instruments that share the same name
const updateAllInstrumentsByName = async (currentName, newName) => {
    const result = await pool.query(
        `
      UPDATE instrument
      SET name = $1
      WHERE name = $2
      RETURNING *;
    `,
        [newName, currentName]
    )
    return result.rows
}

// Delete all instruments that share the same name
const deleteAllInstrumentsByName = async (name) => {
    const result = await pool.query(
        'DELETE FROM instrument WHERE name = $1 RETURNING *',
        [name]
    )
    return result.rows
}

const createInstrument = async (orchestraMemberId, instrumentName) => {
    const id = uuidv4()
    const result = await pool.query(
        `INSERT INTO instrument (id, id_orchestra_member, name)
         VALUES ($1, $2, $3) RETURNING *`, // Add RETURNING * to get the result back
        [id, orchestraMemberId, instrumentName]
    )
    return result.rows[0] // Return the inserted row
}

const deleteInstrumentsByOrchestraMemberId = async (orchestraMemberId) => {
    await pool.query('DELETE FROM instrument WHERE id_orchestra_member = $1', [
        orchestraMemberId,
    ])
}

module.exports = {
    findByName,
    getAllInstruments,
    getAllInstrumentsDistincted,
    getInstrumentsByMemberId,
    updateAllInstrumentsByName,
    deleteAllInstrumentsByName,
    createInstrument,
    deleteInstrumentsByOrchestraMemberId,
}
