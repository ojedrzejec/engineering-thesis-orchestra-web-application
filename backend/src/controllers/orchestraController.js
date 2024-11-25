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
        await Orchestra_OrchestraOrchestraMember_Owner_Model.getOrchestraById(
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

        res.json(orchestra)
    } catch (err) {
        res.status(500).json({ msg: 'Server error while createOrchestra' })
    }
}

const updateOrchestra = async (req, res) => {
    const {
        id,
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
        // Check if the orchestra exists
        const orchestraExists =
            await Orchestra_OrchestraOrchestraMember_Owner_Model.getOrchestraById(
                id
            )
        if (!orchestraExists) {
            return res.status(404).json({ msg: 'Orchestra not found' })
        }

        // Update the orchestra details
        const updatedOrchestra =
            await Orchestra_OrchestraOrchestraMember_Owner_Model.updateOrchestra(
                {
                    id,
                    name,
                    logo: logo || null, // Ensure null is passed if logo is empty,
                    email,
                    address,
                    history,
                    facebook_url,
                    instagram_url,
                    youtube_url,
                }
            )

        console.log('updatedOrchestra: ', updatedOrchestra)
        res.status(200).json(updatedOrchestra)
    } catch {
        res.status(500).json({ msg: 'Server error while updateOrchestra' })
    }
}

module.exports = {
    getAllOrchestras,
    getOrchestra,
    getOrchestrasWithMemberId,
    getAllOrchestraOrchestraMember,
    createOrchestra,
    updateOrchestra,
}
