const pool = require('../config/database')
const { v4: uuidv4 } = require('uuid')

const getAllConcertsByOrchestraId = async (orchestraId) => {
    const result = await pool.query(
        `SELECT * FROM concert WHERE id_orchestra = $1`,
        [orchestraId]
    )
    return result.rows
}

const getConcertById = async (concertId) => {
    const result = await pool.query(`SELECT * FROM concert WHERE id = $1`, [
        concertId,
    ])
    return result.rows[0]
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

const getMemberAvailability = async (id_orchestra_member, id_concert) => {
    const result = await pool.query(
        `SELECT * FROM orchestra_member_concert_availability 
          WHERE id_orchestra_member = $1 AND id_concert = $2
        `,
        [id_orchestra_member, id_concert]
    )
    return result.rows[0]
}

const getMemberAvailabilityAllConcerts = async (MemberId, OrchestraId) => {
    const result = await pool.query(
        `SELECT * FROM orchestra_member_concert_availability 
          WHERE id_orchestra_member = $1 AND id_concert IN (
            SELECT id FROM concert WHERE id_orchestra = $2
          )
        `,
        [MemberId, OrchestraId]
    )
    return result.rows
}

const getAllMembersAvailabilityByConcertId = async (concertId) => {
    const result = await pool.query(
        `SELECT
          c.id,
          om.id,
          om.email,
          om.first_name,
          om.last_name,
          omca.is_available
        FROM orchestra_member om
        LEFT JOIN orchestra_orchestra_member oom
          ON oom.id_orchestra_member = om.id
        LEFT JOIN orchestra o
          ON o.id = oom.id_orchestra
        LEFT JOIN concert c
          ON c.id_orchestra = o.id
        LEFT JOIN orchestra_member_concert_availability omca
          ON omca.id_orchestra_member = om.id AND omca.id_concert = c.id
        WHERE c.id = $1
        ORDER BY omca.is_available, om.first_name, om.last_name;
        `,
        [concertId]
    )
    return result.rows
}

const createMemberAvailability = async (
    id_orchestra_member,
    id_concert,
    is_available
) => {
    const result = await pool.query(
        `INSERT INTO orchestra_member_concert_availability (id_orchestra_member, id_concert, is_available) 
          VALUES ($1, $2, $3) 
          RETURNING *;
        `,
        [id_orchestra_member, id_concert, is_available]
    )
    return result.rows[0]
}

const updateMemberAvailability = async (
    id_orchestra_member,
    id_concert,
    is_available
) => {
    const result = await pool.query(
        `UPDATE orchestra_member_concert_availability 
          SET is_available = $1
          WHERE id_orchestra_member = $2 AND id_concert = $3
          RETURNING *;
        `,
        [is_available, id_orchestra_member, id_concert]
    )
    return result.rows[0]
}

module.exports = {
    getAllConcertsByOrchestraId,
    getConcertById,
    createConcert,
    getMemberAvailability,
    getMemberAvailabilityAllConcerts,
    getAllMembersAvailabilityByConcertId,
    createMemberAvailability,
    updateMemberAvailability,
}
