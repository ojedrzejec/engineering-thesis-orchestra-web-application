const OrchestraMemberModel = require('../models/OrchestraMemberModel')

// get all
const getAllOrchestraMembers = async (req, res) => {
    try {
        const orchestraMembers =
            await OrchestraMemberModel.getAllOrchestraMembers()
        if (!orchestraMembers.length) {
            return res.status(404).json({ msg: 'No orchestra members found.' })
        }
        res.status(200).json(orchestraMembers)
    } catch (err) {
        res.status(500).json({
            msg: 'Server error while getting all orchestra members.',
        })
    }
}

// get single
const getOrchestraMemberById = async (req, res) => {
    const id = req.params.id
    try {
        const orchestraMember =
            await OrchestraMemberModel.getOrchestraMemberById(id)
        console.log('getOrchestraMemberById')
        if (!orchestraMember) {
            return res.status(404).json({ msg: 'Orchestra member not found.' })
        }
        res.status(200).json(orchestraMember)
    } catch (err) {
        res.status(500).json({
            msg: 'Server error while getting orchestra member by id.',
        })
    }
}

// delete single

// update single

module.exports = {
    getAllOrchestraMembers,
    getOrchestraMemberById,
}
