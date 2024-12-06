const GroupModel = require('../models/GroupModel')

const getAllGroups = async (req, res) => {
    const orchestraId = req.params.id

    try {
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

module.exports = {
    getAllGroups,
}
