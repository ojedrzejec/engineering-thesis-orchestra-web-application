const OrchestraMemberModel = require('../models/OrchestraMemberModel')
const InstrumentModel = require('../models/InstrumentModel')

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
const getOrchestraMember = async (req, res) => {
    const id = req.params.id
    try {
        const orchestraMember =
            await OrchestraMemberModel.getOrchestraMemberById(id)
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

const getOrchestraMemberSingle = async (req, res) => {
    try {
        const orchestraMember =
            await OrchestraMemberModel.getOrchestraMemberById(req.user.id)
        if (!orchestraMember) {
            return res.status(404).json({ msg: 'Orchestra member not found.' })
        }

        // Get all instruments associated with this orchestra member
        const instruments = await InstrumentModel.getInstrumentsByMemberId(
            req.user.id
        )
        orchestraMember.instruments = instruments.map(
            (instrument) => instrument.name
        )

        res.status(200).json(orchestraMember)
    } catch (err) {
        res.status(500).json({
            msg: 'Server error while getting orchestra member by id.',
        })
    }
}

// delete single
const deleteOrchestraMember = async (req, res) => {
    const id = req.params.id
    try {
        const orchestraMember = await OrchestraMemberModel.findById(id)
        if (!orchestraMember) {
            return res.status(404).json({ msg: 'Orchestra member not found.' })
        }

        // delete all related instruments first
        await InstrumentModel.deleteInstrumentsByOrchestraMemberId(id)

        // now delete the orchestra member
        const deletedMember =
            await OrchestraMemberModel.deleteOrchestraMemberById(id)
        if (!deletedMember) {
            return res
                .status(404)
                .json({ msg: 'Orchestra member not found or already deleted.' })
        }

        res.status(200).json({
            msg: `Orchestra member with ID: '${id}' deleted successfully!`,
        })
    } catch (err) {
        console.error('Error deleting orchestra member:', err)
        res.status(500).json({
            msg: 'Server error while deleting orchestra member by id.',
        })
    }
}

// patch single
const patchOrchestraMember = async (req, res) => {
    const id = req.params.id
    const {
        first_name,
        last_name,
        instruments, // Expecting a comma-separated string of instrument names
        phone,
        birth_date,
        are_you_student,
        university,
        profile_picture,
        description,
    } = req.body

    try {
        // Check if the orchestra member exists
        const orchestraMember = await OrchestraMemberModel.findById(id)
        if (!orchestraMember) {
            return res.status(404).json({ msg: 'Orchestra member not found.' })
        }

        // Update the orchestra member details
        const updatedOrchestraMember =
            await OrchestraMemberModel.updateOrchestraMemberById(id, {
                first_name,
                last_name,
                phone,
                birth_date,
                are_you_student,
                university,
                profile_picture,
                description,
            })

        // Handle instrument updates
        if (instruments) {
            const instrumentNames = instruments
                .split(',')
                .map((name) => name.trim())
            // Delete existing instruments for this member
            await InstrumentModel.deleteInstrumentsByOrchestraMemberId(id)
            // Add new instruments
            for (const instrumentName of instrumentNames) {
                await InstrumentModel.createInstrumentWithMember(
                    id,
                    instrumentName
                )
            }
        }

        res.status(200).json(updatedOrchestraMember)
    } catch (err) {
        console.error('Error updating orchestra member:', err)
        res.status(500).json({
            msg: 'Server error while updating orchestra member.',
        })
    }
}

module.exports = {
    getAllOrchestraMembers,
    getOrchestraMember,
    getOrchestraMemberSingle,
    deleteOrchestraMember,
    patchOrchestraMember,
}
