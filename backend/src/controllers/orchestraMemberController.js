const OrchestraMemberModel = require('../models/OrchestraMemberModel')
const InstrumentModel = require('../models/InstrumentModel')
const Orchestra_OrchestraOrchestraMember_Owner_Model = require('../models/OrchestraModel_OrchestraOrchestraMember_OWNER')

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

// get all users emails from orchestra member table who are not assigned to the specific orchestra (using orchestra id)
const getAllOrchestraMembersIdsAndEmailsNotAssignedToOrchestraByOrchestraId =
    async (req, res) => {
        const orchestraId = req.params.id
        try {
            // Check if the orchestra exists
            const orchestraExistance =
                await Orchestra_OrchestraOrchestraMember_Owner_Model.getOrchestraById(
                    orchestraId
                )
            if (!orchestraExistance) {
                return res.status(404).json({ msg: 'Orchestra not found' })
            }

            const orchestraMembersIdsAndEmails =
                await OrchestraMemberModel.getAllOrchestraMembersIdsAndEmailsNotAssignedToOrchestraByOrchestraId(
                    orchestraId
                )
            if (!orchestraMembersIdsAndEmails.length) {
                return res.status(404).json({
                    msg: 'No emails found (of orchestra members who are not assigned to this orchestra).',
                })
            }

            res.status(200).json(orchestraMembersIdsAndEmails)
        } catch (err) {
            console.error(
                'Error in getAllOrchestraMembersIdsAndEmailsNotAssignedToOrchestraByOrchestraId:',
                err
            )
            res.status(500).json({
                msg: 'Server error while getting all orchestra members emails.',
            })
        }
    }

const getAllOrchestraMembersAssignedToOrchestraByOrchestraId = async (
    req,
    res
) => {
    const orchestraId = req.params.id
    try {
        // Check if the orchestra exists
        const orchestraExistance =
            await Orchestra_OrchestraOrchestraMember_Owner_Model.getOrchestraById(
                orchestraId
            )
        if (!orchestraExistance) {
            return res.status(404).json({ msg: 'Orchestra not found' })
        }

        const orchestraMembers =
            await OrchestraMemberModel.getAllOrchestraMembersAssignedToOrchestraByOrchestraId(
                orchestraId
            )
        if (!orchestraMembers.length) {
            return res.status(404).json({
                msg: 'No orchestra members found (assigned to this orchestra).',
            })
        }

        // get instruments for each orchestra member
        for (const member of orchestraMembers) {
            const instruments = await InstrumentModel.getInstrumentsByMemberId(
                member.id
            )
            member.instruments = instruments.map(
                (instrument) => instrument.name
            )
        }

        // get roles for each orchestra member
        for (const member of orchestraMembers) {
            const roles =
                await Orchestra_OrchestraOrchestraMember_Owner_Model.getRolesByOrchestraMemberId(
                    orchestraId,
                    member.id
                )

            // return is_owner and is_manager as boolean values
            member.is_owner = roles.map((role) => role.is_owner)[0]
            member.is_manager = roles.map((role) => role.is_manager)[0]
        }

        console.log(orchestraMembers[0])

        // res.status(200).json(orchestraMembers[0])
        res.status(200).json(orchestraMembers)
    } catch (err) {
        console.error(
            'Error in getAllOrchestraMembersAssignedToOrchestraByOrchestraId:',
            err
        )
        res.status(500).json({
            msg: 'Server error while getting all orchestra members.',
        })
    }
}

const getAllOrchestraPlayerByOrchestraId = async (req, res) => {
    const orchestraId = req.params.id
    try {
        // Check if the orchestra exists
        const orchestraExistance =
            await Orchestra_OrchestraOrchestraMember_Owner_Model.getOrchestraById(
                orchestraId
            )
        if (!orchestraExistance) {
            return res.status(404).json({ msg: 'Orchestra not found' })
        }

        const orchestraOrchestraMember =
            await OrchestraMemberModel.getAllOrchestraPlayerByOrchestraId(
                orchestraId
            )
        if (!orchestraOrchestraMember.length) {
            return res.status(404).json({ msg: 'No orchestra members found.' })
        }

        res.status(200).json(orchestraOrchestraMember)
    } catch (err) {
        console.error('Error in getAllOrchestraPlayerByOrchestraId:', err)
        res.status(500).json({
            msg: 'Server error while getting all orchestra players.',
        })
    }
}

// get single
const getOrchestraMember = async (req, res) => {
    const memberId = req.params.id
    try {
        const orchestraMember =
            await OrchestraMemberModel.getOrchestraMemberById(memberId)
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
    const {
        first_name,
        last_name,
        instruments, // array of strings (instrument names)
        phone,
        birth_date,
        are_you_student,
        university,
        profile_picture,
        description,
    } = req.body

    try {
        // Check if the orchestra member exists
        const orchestraMember = await OrchestraMemberModel.findById(req.user.id)
        if (!orchestraMember) {
            return res.status(404).json({ msg: 'Orchestra member not found.' })
        }

        // Update the orchestra member details
        const updatedOrchestraMember =
            await OrchestraMemberModel.updateOrchestraMemberById(req.user.id, {
                first_name,
                last_name,
                phone,
                birth_date,
                are_you_student,
                university,
                profile_picture: profile_picture || null, // Ensure null is passed if profile_picture is empty
                description,
            })

        // Handle instrument updates: delete all instruments and create new ones
        // delete instruments
        const deletedInstruments =
            await InstrumentModel.deleteInstrumentsByOrchestraMemberId(
                req.user.id
            )
        if (!deletedInstruments) {
            return res
                .status(404)
                .json({ msg: 'Error deleting user previous instruments.' })
        }

        const updatedInstruments = []
        for (const instrument of instruments) {
            // create new instruments
            const updatedInstrument = await InstrumentModel.createInstrument(
                req.user.id,
                instrument
            )
            if (!updatedInstrument) {
                return res
                    .status(404)
                    .json({ msg: 'Error creating the instrument.' })
            }
            updatedInstruments.push(updatedInstrument)
        }

        updatedOrchestraMember.instruments = updatedInstruments
        console.log(updatedOrchestraMember)
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
    getAllOrchestraMembersIdsAndEmailsNotAssignedToOrchestraByOrchestraId,
    getAllOrchestraMembersAssignedToOrchestraByOrchestraId,
    getOrchestraMember,
    getAllOrchestraPlayerByOrchestraId,
    getOrchestraMemberSingle,
    deleteOrchestraMember,
    patchOrchestraMember,
}
