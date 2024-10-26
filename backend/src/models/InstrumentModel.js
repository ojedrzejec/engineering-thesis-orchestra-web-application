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
const getInstruments = async () => {
    const result = await pool.query('SELECT DISTINCT name FROM instrument')
    return result.rows
}

const deleteInstrument = async (name) => {
    const result = await pool.query('DELETE FROM instrument WHERE name = $1', [
        name,
    ])
    return result.rows[0]
}

const createInstrument = async (instrumentName) => {
    const id = uuidv4() // Generate a new UUID
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

const updateInstrumentName = async (id, name) => {
    const result = await pool.query(
        `
      UPDATE instrument
      SET name = $2
      WHERE id = $1
      RETURNING *;
    `,
        [id, name]
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

// const updateInstrumentsForOrchestraMember = async (orchestraMemberId, instrumentIds, newInstrumentsNames) => {
//     // Delete all the existing instruments associated with the orchestra member
//     await pool.query(
//         `DELETE FROM instrument WHERE id_orchestra_member = $1`,
//         [orchestraMemberId]
//     )

//     // Insert the new instruments associated with the orchestra member
//     for (const instrumentId of instrumentIds) {
//         const id = uuidv4()
//         await pool.query(
//             `INSERT INTO instrument (id, id_orchestra_member )
//          VALUES ($1, $2)`,
//             [orchestraMemberId, instrumentId]
//         )
//     }
// }

module.exports = {
    // findById,
    findByName,
    getInstruments,
    deleteInstrument,
    createInstrument,
    updateInstrumentName,
    addOrchestraMemberToInstrument,
}
