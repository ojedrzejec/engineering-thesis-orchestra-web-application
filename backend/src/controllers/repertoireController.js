const RepertoireModel = require('../models/RepertoireModel')
const OrchestraMemberModel = require('../models/OrchestraMemberModel')
const Orchestra_OrchestraOrchestraMember_Owner_Model = require('../models/OrchestraModel_OrchestraOrchestraMember_OWNER')
const GroupModel = require('../models/GroupModel')

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

const getOrchestraRepertoire = async (req, res) => {
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

        // Get the orchestra repertoire by orchestra id
        const orchestraRepertoire =
            await RepertoireModel.getOrchestraRepertoireByOrchestraId(
                orchestraId
            )
        if (!orchestraRepertoire) {
            return res
                .status(404)
                .json({ msg: 'Orchestra repertoire not found' })
        }

        res.status(200).json(orchestraRepertoire)
    } catch (err) {
        res.status(500).json({
            msg: 'Server error while getOrchestraRepertoire',
        })
    }
}

const getOrchestraPiecesOfMusic = async (req, res) => {
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

        // Get the orchestra pieces of music by orchestra id
        const orchestraPiecesOfMusic =
            await RepertoireModel.getOrchestraPiecesOfMusicByOrchestraId(
                orchestraId
            )
        if (!orchestraPiecesOfMusic) {
            return res
                .status(404)
                .json({ msg: 'Orchestra repertoire not found' })
        }

        res.status(200).json(orchestraPiecesOfMusic)
    } catch (err) {
        res.status(500).json({
            msg: 'Server error while getOrchestraPiecesOfMusic',
        })
    }
}

const createPieceOfMusic = async (req, res) => {
    const { id_orchestra, title, composer } = req.body

    try {
        // check if the orchestra exists
        const orchestraExistance =
            await Orchestra_OrchestraOrchestraMember_Owner_Model.getOrchestraById(
                id_orchestra
            )
        if (!orchestraExistance) {
            return res.status(404).json({ msg: 'Orchestra not found' })
        }

        if (!title || !composer) {
            return res.status(400).json({ msg: 'Please enter all fields' })
        }

        // Create a new piece of music
        const newPieceOfMusic = await RepertoireModel.createPieceOfMusic(
            id_orchestra,
            title,
            composer
        )
        if (!newPieceOfMusic) {
            return res.status(404).json({ msg: 'Piece of music not created' })
        }

        res.status(201).json(newPieceOfMusic)
    } catch (err) {
        res.status(500).json({
            msg: 'Server error while createPieceOfMusic',
        })
    }
}
const addMusicSheetNotes = async (req, res) => {
    const { orchestraId, pieceOfMusicId, pdf, groupId } = req.body

    try {
        // check if the orchestra exists
        const orchestraExistance =
            await Orchestra_OrchestraOrchestraMember_Owner_Model.getOrchestraById(
                orchestraId
            )
        if (!orchestraExistance) {
            return res.status(404).json({ msg: 'Orchestra not found' })
        }

        // check if the piece of music exists
        const pieceOfMusicExistance =
            await RepertoireModel.findPieceOfMusicById(pieceOfMusicId)
        if (!pieceOfMusicExistance) {
            return res.status(404).json({ msg: 'Piece of music not found' })
        }

        // check if the group exists
        const groupExistance = await GroupModel.getGroupById(groupId)
        if (!groupExistance) {
            return res.status(404).json({ msg: 'Group not found' })
        }

        // Add music sheet notes
        const musicSheetNotes = await RepertoireModel.addMusicSheetNotes(
            pieceOfMusicId,
            pdf,
            groupId
        )
        if (!musicSheetNotes) {
            return res.status(404).json({ msg: 'Music sheet notes not added' })
        }

        res.status(201).json(musicSheetNotes)
    } catch (err) {
        res.status(500).json({
            msg: 'Server error while addMusicSheetNotes',
        })
    }
}

module.exports = {
    getMemberGroup,
    getMemberRepertoire,
    getOrchestraRepertoire,
    getOrchestraPiecesOfMusic,
    createPieceOfMusic,
    addMusicSheetNotes,
}
