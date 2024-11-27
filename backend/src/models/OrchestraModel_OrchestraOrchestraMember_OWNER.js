const pool = require('../config/database')
const { v4: uuidv4 } = require('uuid')

const getAllOrchestras = async () => {
    const result = await pool.query('SELECT * FROM orchestra')
    return result.rows
}

const getOrchestraById = async (orchestraId) => {
    const result = await pool.query('SELECT * FROM orchestra WHERE id = $1', [
        orchestraId,
    ])
    return result.rows[0]
}

const getOrchestrasWithMemberId = async (userId) => {
    const result = await pool.query(
        `
        SELECT 
            o.id, 
            o.name,
            oom.is_owner,
            oom.is_manager
        FROM 
            orchestra o
        LEFT JOIN 
            orchestra_orchestra_member oom 
        ON 
            o.id = oom.id_orchestra
        WHERE 
            oom.id_orchestra_member = $1
    `,
        [userId]
    )
    return result.rows
}

const getRolesByOrchestraMemberId = async (orchestraId, orchestraMemberId) => {
    const result = await pool.query(
        `SELECT is_owner, is_manager FROM orchestra_orchestra_member WHERE id_orchestra = $1 AND id_orchestra_member = $2`,
        [orchestraId, orchestraMemberId]
    )
    return result.rows
}

// Method to create a new orchestra and associate it with the owner
const createOrchestra = async ({
    name,
    logo,
    email,
    address,
    history,
    facebook_url,
    instagram_url,
    youtube_url,
    ownerId,
}) => {
    try {
        // Insert the new orchestra into the database
        const id_new_orchestra = uuidv4() // Generate a new UUID
        const result = await pool.query(
            `INSERT INTO orchestra (
                "id",
                "name",
                "logo", 
                "email", 
                "address", 
                "history", 
                "facebook_url", 
                "instagram_url", 
                "youtube_url" 
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING *`,
            [
                id_new_orchestra,
                name,
                logo,
                email,
                address,
                history,
                facebook_url,
                instagram_url,
                youtube_url,
            ]
        )

        const orchestra = result.rows[0]

        // Associate the owner with the newly created orchestra
        await pool.query(
            `INSERT INTO orchestra_orchestra_member (id_orchestra, id_orchestra_member, is_owner, is_manager)
         VALUES ($1, $2, $3, $4)`,
            [orchestra.id, ownerId, true, false]
        )

        return orchestra
    } catch (err) {
        console.error(err)
        throw new Error('Error creating orchestra')
    }
}

const updateOrchestra = async ({
    id,
    name,
    logo,
    email,
    address,
    history,
    facebook_url,
    instagram_url,
    youtube_url,
}) => {
    try {
        const result = await pool.query(
            `UPDATE orchestra
            SET name = COALESCE($1, name),
                logo = $2,
                email = COALESCE($3, email),
                address = COALESCE($4, address),
                history = COALESCE($5, history),
                facebook_url = COALESCE($6, facebook_url),
                instagram_url = COALESCE($7, instagram_url),
                youtube_url = COALESCE($8, youtube_url)
            WHERE id = $9
            RETURNING *;`,
            [
                name,
                logo,
                email,
                address,
                history,
                facebook_url,
                instagram_url,
                youtube_url,
                id,
            ]
        )
        return result.rows[0]
    } catch (err) {
        console.error('Error updating orchestra:', err)
        throw new Error('Error updating orchestra')
    }
}

module.exports = {
    getAllOrchestras,
    getOrchestraById,
    getOrchestrasWithMemberId,
    getRolesByOrchestraMemberId,
    createOrchestra,
    updateOrchestra,
}
