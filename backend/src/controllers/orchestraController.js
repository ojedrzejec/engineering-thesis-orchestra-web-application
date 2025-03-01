const Orchestra_OrchestraOrchestraMember_Owner_Model = require('../models/OrchestraModel_OrchestraOrchestraMember_OWNER')
const OrchestraOrchestraMemberModel = require('../models/OrchestraOrchestraMemberModel')
const OrchestraMemberModel = require('../models/OrchestraMemberModel')

const getAllOrchestras = async (req, res) => {
    const orchestras =
        await Orchestra_OrchestraOrchestraMember_Owner_Model.getAllOrchestras()
    res.status(200).json(orchestras)
}

const getOrchestra = async (req, res) => {
    const orchestraId = req.params.id
    const orchestra =
        await Orchestra_OrchestraOrchestraMember_Owner_Model.getOrchestraById(
            orchestraId
        )
    res.status(200).json(orchestra)
}

const getOrchestrasWithMemberId = async (req, res) => {
    const orchestrasWithOrchestraMember =
        await Orchestra_OrchestraOrchestraMember_Owner_Model.getOrchestrasWithMemberId(
            req.user.id
        )
    console.log(orchestrasWithOrchestraMember)
    res.status(200).json(orchestrasWithOrchestraMember)
}

const getAllOrchestraOrchestraMember = async (req, res) => {
    const orchestraOrchestraMember =
        await OrchestraOrchestraMemberModel.getAllOrchestraOrchestraMember()
    res.status(200).json(orchestraOrchestraMember)
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

        res.status(201).json(orchestra)
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

const addMemberToOrchestra = async (req, res) => {
    const { id_orchestra, id_orchestra_member, is_owner, is_manager } = req.body
    try {
        // Check if the orchestra exists
        const orchestraExists =
            await Orchestra_OrchestraOrchestraMember_Owner_Model.getOrchestraById(
                id_orchestra
            )
        if (!orchestraExists) {
            return res.status(404).json({ msg: 'Orchestra not found' })
        }

        // Check if the orchestra member exists
        const orchestraMemberExists =
            await OrchestraMemberModel.getOrchestraMemberById(
                id_orchestra_member
            )
        if (!orchestraMemberExists) {
            return res.status(404).json({ msg: 'Orchestra member not found' })
        }

        // Check if the member is already assigned to the orchestra
        const memberAlreadyAssignedToOrchestra =
            await OrchestraOrchestraMemberModel.getOrchestraMemberByOrchestraIdAndMemberId(
                id_orchestra,
                id_orchestra_member
            )
        if (memberAlreadyAssignedToOrchestra) {
            return res.status(400).json({
                msg: 'Orchestra member is already assigned to the orchestra',
            })
        }

        // Add the member to the orchestra
        const newOrchestraOrchestraMember =
            await OrchestraOrchestraMemberModel.addMemberToOrchestra(
                id_orchestra,
                id_orchestra_member,
                is_owner,
                is_manager
            )

        res.status(200).json(newOrchestraOrchestraMember)
    } catch (err) {
        console.error('Error in addMemberToOrchestra:', err.message, err.stack)
        res.status(500).json({ msg: 'Server error while addMemberToOrchestra' })
    }
}

const updateMemberAsManager = async (req, res) => {
    const { id_orchestra, id_orchestra_member, is_manager } = req.body
    try {
        // Check if the orchestra exists
        const orchestraExists =
            await Orchestra_OrchestraOrchestraMember_Owner_Model.getOrchestraById(
                id_orchestra
            )
        if (!orchestraExists) {
            return res.status(404).json({ msg: 'Orchestra not found' })
        }

        // Check if the orchestra member exists
        const orchestraMemberExists =
            await OrchestraMemberModel.getOrchestraMemberById(
                id_orchestra_member
            )
        if (!orchestraMemberExists) {
            return res.status(404).json({ msg: 'Orchestra member not found' })
        }

        // Check if the member is already assigned to the orchestra
        const memberAlreadyAssignedToOrchestra =
            await OrchestraOrchestraMemberModel.getOrchestraMemberByOrchestraIdAndMemberId(
                id_orchestra,
                id_orchestra_member
            )
        if (!memberAlreadyAssignedToOrchestra) {
            return res.status(400).json({
                msg: 'Orchestra member is not assigned to the orchestra',
            })
        }

        // Update the member as manager
        const updatedOrchestraMember =
            await OrchestraOrchestraMemberModel.updateMemberAsManager(
                id_orchestra,
                id_orchestra_member,
                is_manager
            )

        res.status(200).json(updatedOrchestraMember)
    } catch (err) {
        console.error('Error in updateMemberAsManager:', err.message, err.stack)
        res.status(500).json({
            msg: 'Server error while updateMemberAsManager',
        })
    }
}

module.exports = {
    getAllOrchestras,
    getOrchestra,
    getOrchestrasWithMemberId,
    getAllOrchestraOrchestraMember,
    createOrchestra,
    updateOrchestra,
    addMemberToOrchestra,
    updateMemberAsManager,
}
