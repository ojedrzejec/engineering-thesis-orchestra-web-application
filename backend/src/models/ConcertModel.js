const pool = require('../config/database')
const { v4: uuidv4 } = require('uuid')

const getAllConcertsByOrchestraId = async (orchestraId) => {
    const result = await pool.query(
        `SELECT * FROM concert WHERE id_orchestra = $1`,
        [orchestraId]
    )
    return result.rows
}

const createConcert = async (
    id_orchestra,
    name,
    date,
    time,
    place,
    description,
    reservation_url,
    graphic
) => {
    const id = uuidv4()
    const result = await pool.query(
        `INSERT INTO concert (id, id_orchestra, name, date, time, place, description, reservation_url, graphic) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;`,
        [
            id,
            id_orchestra,
            name,
            date,
            time,
            place,
            description,
            reservation_url,
            graphic,
        ]
    )
    return result.rows[0]
}

module.exports = {
    getAllConcertsByOrchestraId,
    createConcert,
}
