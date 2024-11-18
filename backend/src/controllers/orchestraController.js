const Orchestra_OrchestraOrchestraMember_Owner_Model = require('../models/OrchestraModel_OrchestraOrchestraMember_OWNER')
const OrchestraOrchestraMemberModel = require('../models/OrchestraOrchestraMemberModel')
// const jwt = require('jsonwebtoken')
// const { updateJsonWebToken } = require('../controllers/authController')

const getAllOrchestras = async (req, res) => {
    const orchestras =
        await Orchestra_OrchestraOrchestraMember_Owner_Model.getAllOrchestras()
    res.json(orchestras)
}

const getOrchestra = async (req, res) => {
    const orchestraId = req.params.id
    const orchestra =
        await Orchestra_OrchestraOrchestraMember_Owner_Model.getOrchestraByMemberId(
            orchestraId
        )
    res.json(orchestra)
}

const getOrchestrasWithMemberId = async (req, res) => {
    const orchestrasWithOrchestraMember =
        await Orchestra_OrchestraOrchestraMember_Owner_Model.getOrchestrasWithMemberId(
            req.user.id
        )
    console.log(orchestrasWithOrchestraMember)
    res.json(orchestrasWithOrchestraMember)
}

const getAllOrchestraOrchestraMember = async (req, res) => {
    const orchestraOrchestraMember =
        await OrchestraOrchestraMemberModel.getAllOrchestraOrchestraMember()
    res.json(orchestraOrchestraMember)
}

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

        // const token = updateJsonWebToken(req.user.id)

        res.json({ token, orchestra })
    } catch (err) {
        res.status(500).json({ msg: 'Server error while createOrchestra' })
    }
}

module.exports = {
    getAllOrchestras,
    getOrchestra,
    getOrchestrasWithMemberId,
    getAllOrchestraOrchestraMember,
    createOrchestra,
}
