const RepertoireModel = require('../models/RepertoireModel')
const OrchestraMemberModel = require('../models/OrchestraMemberModel')

const getMemberGroup = async (req, res) => {
    const memberId = req.user.id
    try {
        // Find orchestra member by id
        const orchestraMember = await OrchestraMemberModel.findById(memberId)
        if (!orchestraMember) {
            return res.status(404).json({ msg: 'Orchestra member not found' })
        }

        // Get the member group by member id
        const memberGroup = await RepertoireModel.getMemberGroupByMemberId(
            memberId
        )
        if (!memberGroup) {
            return res.status(404).json({ msg: 'Member group not found' })
        }

        res.status(200).json(memberGroup)
    } catch (err) {
        res.status(500).json({
            msg: 'Server error while getMemberGroup',
        })
    }
}

const getMemberRepertoire = async (req, res) => {
    const orchestraId = req.params.id
    const memberId = req.user.id

    try {
        // Find orchestra member by id
        const orchestraMember = await OrchestraMemberModel.findById(memberId)
        if (!orchestraMember) {
            return res.status(404).json({ msg: 'Orchestra member not found' })
        }

        // Get the member group by member id
        const memberGroup = await RepertoireModel.getMemberGroupByMemberId(
            memberId
        )
        if (!memberGroup) {
            return res.status(404).json({ msg: 'Member group not found' })
        }

        // Get the member repertoire by group id
        const memberRepertoire =
            await RepertoireModel.getMemberRepertoireByGroupId(
                orchestraId,
                memberGroup.id
            )
        if (!memberRepertoire) {
            return res.status(404).json({ msg: 'Member repertoire not found' })
        }

        res.status(200).json(memberRepertoire)
    } catch (err) {
        res.status(500).json({
            msg: 'Server error while getMemberRepertoire',
        })
    }
}

module.exports = {
    getMemberGroup,
    getMemberRepertoire,
}
