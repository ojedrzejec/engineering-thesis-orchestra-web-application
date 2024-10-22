const Orchestra_OrchestraOrchestraMember_Owner_Model = require('../models/OrchestraModel_OrchestraOrchestraMember_OWNER')
// const jwt = require('jsonwebtoken')
const { updateJsonWebToken } = require('../controllers/authController')

const createOrchestra = async (req, res) => {
    const {
        name,
        logo,
        email,
        address,
        history,
        facebook_url,
        instagram_url,
        youtube_url,
    } = req.body
    try {
        // Create the orchestra and associate it with the owner (current user)
        const orchestra =
            await Orchestra_OrchestraOrchestraMember_Owner_Model.createOrchestra(
                {
                    name,
                    logo,
                    email,
                    address,
                    history,
                    facebook_url,
                    instagram_url,
                    youtube_url,
                    ownerId: req.user.id,
                }
            )

        // Update user role to owner for this specific orchestra
        const token = updateJsonWebToken(req.user.id, 'owner', orchestra.id)
        // const token = jwt.sign(
        //     { id: req.user.id, role: 'owner', orchestraId: orchestra.id },
        //     process.env.JWT_SECRET,
        //     { expiresIn: '1h' }
        // )

        res.json({ token, orchestra })
    } catch (err) {
        console.error(err)
        res.status(500).json({ msg: 'Server error' })
    }
}

module.exports = {
    createOrchestra,
}
