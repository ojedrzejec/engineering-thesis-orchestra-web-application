const pool = require('../config/database')
const { v4: uuidv4 } = require('uuid')

// const findById = async (id) => {
//     const result = await pool.query('SELECT * FROM instrument WHERE id = $1', [
//         id,
//     ])
//     return result.rows[0]
// }

const findByName = async (name) => {
    const result = await pool.query(
        'SELECT * FROM instrument WHERE name = $1',
        [name]
    )
    return result.rows[0]
}

// get all instruments but do not repeat the same instrument if there are few instruments with the same name
const getAllInstruments = async () => {
    const result = await pool.query('SELECT DISTINCT name FROM instrument')
    return result.rows
}

// Get a single instrument associated with the specific orchestra member
const getInstrumentByMemberId = async (orchestraMemberId) => {
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

// for owner
const createInstrument = async (instrumentName) => {
    const id = uuidv4()
    const result = await pool.query(
        `
      INSERT INTO instrument (
        id,
        name
      )
      VALUES ($1, $2)
      RETURNING *;
    `,
        [id, instrumentName]
    )
    return result.rows[0]
}

const addOrchestraMemberToInstrument = async (
    orchestraMemberId,
    instrumentName
) => {
    const foundInstrument = await findByName(instrumentName)
    if (foundInstrument && !foundInstrument.id_orchestra_member) {
        // Update the existing instrument by adding the orchestra member ID
        await linkOrchestraMemberToInstrument(
            foundInstrument.id,
            orchestraMemberId
        )
    } else {
        // If the instrument already has an orchestra member, create a new instrument with the same name
        await createNewInstrumentWithMember(orchestraMemberId, instrumentName)
    }
}

// Utility function to link an existing instrument to an orchestra member
const linkOrchestraMemberToInstrument = async (
    instrumentId,
    orchestraMemberId
) => {
    await pool.query(
        `UPDATE instrument
         SET id_orchestra_member = $1
         WHERE id = $2`,
        [orchestraMemberId, instrumentId]
    )
}

// Utility function to create a new instrument entry with an orchestra member
const createNewInstrumentWithMember = async (
    orchestraMemberId,
    instrumentName
) => {
    const id = uuidv4()
    await pool.query(
        `INSERT INTO instrument (id, id_orchestra_member, name)
         VALUES ($1, $2, $3)`,
        [id, orchestraMemberId, instrumentName]
    )
}

const updateOrchestraMemberInstruments = async (
    orchestraMemberId,
    instrumentNames
) => {
    // Begin a transaction
    await pool.query('BEGIN')

    try {
        // Delete existing instruments for the orchestra member
        await pool.query(
            'DELETE FROM instrument WHERE id_orchestra_member = $1',
            [orchestraMemberId]
        )

        // Insert new instruments
        for (const instrumentName of instrumentNames) {
            const id = uuidv4()
            await pool.query(
                `INSERT INTO instrument (id, id_orchestra_member, name)
                 VALUES ($1, $2, $3)`,
                [id, orchestraMemberId, instrumentName]
            )
        }

        // Commit transaction
        await pool.query('COMMIT')
    } catch (error) {
        // Rollback on error
        await pool.query('ROLLBACK')
        throw error
    }
}

const patchOrchestraMemberInstruments = async (
    orchestraMemberId,
    newInstruments
) => {
    // Get current instruments
    const currentInstrumentsResult = await pool.query(
        'SELECT * FROM instrument WHERE id_orchestra_member = $1',
        [orchestraMemberId]
    )
    const currentInstruments = currentInstrumentsResult.rows.map(
        (row) => row.name
    )

    // Determine which instruments to add or remove
    const toAdd = newInstruments.filter(
        (name) => !currentInstruments.includes(name)
    )
    const toRemove = currentInstruments.filter(
        (name) => !newInstruments.includes(name)
    )

    // Perform removal and addition
    for (const name of toRemove) {
        await pool.query(
            'DELETE FROM instrument WHERE id_orchestra_member = $1 AND name = $2',
            [orchestraMemberId, name]
        )
    }

    for (const name of toAdd) {
        const id = uuidv4()
        await pool.query(
            `INSERT INTO instrument (id, id_orchestra_member, name)
             VALUES ($1, $2, $3)`,
            [id, orchestraMemberId, name]
        )
    }
}

// 'DELETE FROM instrument WHERE id_orchestra_member = $1'
const deleteInstrumentsByOrchestraMemberId = async (orchestraMemberId) => {
    await pool.query('DELETE FROM instrument WHERE id_orchestra_member = $1', [
        orchestraMemberId,
    ])
}

module.exports = {
    // findById,
    findByName,
    getAllInstruments,
    getInstrumentByMemberId,
    updateAllInstrumentsByName,
    deleteAllInstrumentsByName,
    createInstrument,
    addOrchestraMemberToInstrument,
    updateOrchestraMemberInstruments,
    patchOrchestraMemberInstruments,
    deleteInstrumentsByOrchestraMemberId,
}
