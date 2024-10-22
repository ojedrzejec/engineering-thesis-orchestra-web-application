const pool = require('../config/database')
const { v4: uuidv4 } = require('uuid')

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

module.exports = {
    createOrchestra,
}
