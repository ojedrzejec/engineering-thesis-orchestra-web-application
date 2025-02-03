const GroupModel = require('../models/GroupModel')
const Orchestra_OrchestraOrchestraMember_Owner_Model = require('../models/OrchestraModel_OrchestraOrchestraMember_OWNER')
const OrchestraMemberModel = require('../models/OrchestraMemberModel')
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
                // console.log('instruments:', instruments)
            }
            // console.log('members:', members)

            groups[i].members = members
        }
        // console.log('groups:', groups)

        res.status(200).json(groups)
    } catch (err) {
        res.status(500).json({
            msg: 'Server error while getting all orchestra groups with members and their instruments.',
        })
    }
}

const getAllMembersNotInAnyGroup = async (req, res) => {
    // on frontend: `${API_BASE_URL}/group/members-out-of-the-group/${orchestraId}/${groupId}`
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

        // select all members out of the group by group id
        const members = await GroupModel.getAllMembersNotInAnyGroup(orchestraId)
        if (!members.length) {
            return res.status(404).json({ msg: 'No orchestra members found.' })
        }

        res.status(200).json(members)
    } catch (err) {
        res.status(500).json({
            msg: 'Server error while getting all orchestra members not assigned to any group.',
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

        // check if the group name is unique
        const groupExistance = await GroupModel.getGroupByName(
            name,
            id_orchestra
        )
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

const addMemberToGroup = async (req, res) => {
    const { id_orchestra, id_group, id_member } = req.body

    try {
        // check if the orchestra exists
        const orchestraExistance =
            await Orchestra_OrchestraOrchestraMember_Owner_Model.getOrchestraById(
                id_orchestra
            )
        if (!orchestraExistance) {
            return res.status(404).json({ msg: 'Orchestra not found' })
        }

        // check if the group exists
        const groupExistance = await GroupModel.getGroupById(id_group)
        if (!groupExistance) {
            return res.status(404).json({ msg: 'Group not found' })
        }

        // check if the member exists
        const memberExistance =
            await OrchestraMemberModel.getOrchestraMemberById(id_member)
        if (!memberExistance) {
            return res.status(404).json({ msg: 'Member not found' })
        }

        // check if the member is already in the group
        const memberInGroupExistance = await GroupModel.getMemberInGroup(
            id_group,
            id_member
        )
        if (memberInGroupExistance) {
            return res
                .status(400)
                .json({ msg: 'Member is already in the group.' })
        }

        // add member to the group
        const newMember = await GroupModel.addMemberToGroup(id_group, id_member)
        if (!newMember) {
            return res
                .status(500)
                .json({ msg: 'Failed to add member to the group.' })
        }

        res.status(201).json(newMember)
    } catch (err) {
        res.status(500).json({
            msg: 'Server error while adding member to the group.',
        })
    }
}

module.exports = {
    getAllGroups,
    getAllGroupsWithMembers,
    getAllMembersNotInAnyGroup,
    createNewGroup,
    addMemberToGroup,
}
