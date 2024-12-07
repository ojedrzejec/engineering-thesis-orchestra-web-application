const GroupModel = require('../models/GroupModel')
const Orchestra_OrchestraOrchestraMember_Owner_Model = require('../models/OrchestraModel_OrchestraOrchestraMember_OWNER')

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
        console.log('orchestraExistance:', orchestraExistance)

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
    createNewGroup,
}
