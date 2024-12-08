const GroupModel = require('../models/GroupModel')
const Orchestra_OrchestraOrchestraMember_Owner_Model = require('../models/OrchestraModel_OrchestraOrchestraMember_OWNER')
const InstrumentModel = require('../models/InstrumentModel')

const getAllGroups = async (req, res) => {
    const orchestraId = req.params.id

    try {
        // check if the orchestra exists
        const orchestraExistance =
            await Orchestra_OrchestraOrchestraMember_Owner_Model.getOrchestraById(
                orchestraId
            )
        if (!orchestraExistance) {
            return res.status(404).json({ msg: 'Orchestra not found' })
        }
        // console.log('orchestraExistance:', orchestraExistance)

        // select all groups by orchestra id
        const groups = await GroupModel.getAllGroupsByOrchestraId(orchestraId)
        if (!groups.length) {
            return res.status(404).json({ msg: 'No orchestra groups found.' })
        }
        res.status(200).json(groups)
    } catch (err) {
        res.status(500).json({
            msg: 'Server error while getting all orchestra groups.',
        })
    }
}

const getAllGroupsWithMembers = async (req, res) => {
    const orchestraId = req.params.id

    try {
        // check if the orchestra exists
        const orchestraExistance =
            await Orchestra_OrchestraOrchestraMember_Owner_Model.getOrchestraById(
                orchestraId
            )
        if (!orchestraExistance) {
            return res.status(404).json({ msg: 'Orchestra not found' })
        }
        // console.log('orchestraExistance:', orchestraExistance)

        // select all groups by orchestra id
        const groups = await GroupModel.getAllGroupsByOrchestraId(orchestraId)
        if (!groups.length) {
            return res.status(404).json({ msg: 'No orchestra groups found.' })
        }

        // get all members for each group
        for (let i = 0; i < groups.length; i++) {
            const members = await GroupModel.getAllMembersByGroupId(
                groups[i].id
            )

            // get instruments for each orchestra member
            for (const member of members) {
                const instruments =
                    await InstrumentModel.getInstrumentsByMemberId(member.id)
                member.instruments = instruments.map(
                    (instrument) => instrument.name
                )
                console.log('instruments:', instruments)
            }
            console.log('members:', members)

            groups[i].members = members
        }

        console.log('groups:', groups)

        res.status(200).json(groups)
    } catch (err) {
        res.status(500).json({
            msg: 'Server error while getting all orchestra groups with members and their instruments.',
        })
    }
}

const createNewGroup = async (req, res) => {
    const { name, id_orchestra } = req.body

    try {
        // check if the orchestra exists
        const orchestraExistance =
            await Orchestra_OrchestraOrchestraMember_Owner_Model.getOrchestraById(
                id_orchestra
            )
        if (!orchestraExistance) {
            return res.status(404).json({ msg: 'Orchestra not found' })
        }
        console.log('orchestraExistance:', orchestraExistance)

        // check if the group name is unique
        const groupExistance = await GroupModel.getGroupByName(name)
        if (groupExistance) {
            return res.status(400).json({ msg: 'Group name already exists.' })
        }

        // create new group
        const newGroup = await GroupModel.createGroup(name, id_orchestra)
        if (!newGroup) {
            return res.status(500).json({ msg: 'Failed to create new group.' })
        }
        res.status(201).json(newGroup)
    } catch (err) {
        res.status(500).json({ msg: 'Server error while creating new group.' })
    }
}

module.exports = {
    getAllGroups,
    getAllGroupsWithMembers,
    createNewGroup,
}
