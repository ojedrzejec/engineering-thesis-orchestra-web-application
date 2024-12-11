const ConcertModel = require('../models/ConcertModel')
const Orchestra_OrchestraOrchestraMember_Owner_Model = require('../models/OrchestraModel_OrchestraOrchestraMember_OWNER')
const OrchestraMemberModel = require('../models/OrchestraMemberModel')

const getAllConcerts = async (req, res) => {
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

        const concerts = await ConcertModel.getAllConcertsByOrchestraId(
            orchestraId
        )
        if (!concerts.length) {
            return res.status(404).json({ msg: 'No concerts found.' })
        }

        res.status(200).json(concerts)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: 'Server error while getting all concerts.',
        })
    }
}

const getMemberAvailabilityAllConcerts = async (req, res) => {
    const MemberId = req.user.id
    const OrchestraId = req.params.id

    try {
        // check if the orchestra member exists
        const orchestraMember =
            await OrchestraMemberModel.getOrchestraMemberById(MemberId)
        if (!orchestraMember) {
            return res.status(404).json({ msg: 'Orchestra member not found.' })
        }

        // check if the orchestra exists
        const orchestraExistance =
            await Orchestra_OrchestraOrchestraMember_Owner_Model.getOrchestraById(
                OrchestraId
            )
        if (!orchestraExistance) {
            return res.status(404).json({ msg: 'Orchestra not found' })
        }

        const memberAvailability =
            await ConcertModel.getMemberAvailabilityAllConcerts(
                MemberId,
                OrchestraId
            )
        if (!memberAvailability) {
            return res
                .status(404)
                .json({ msg: 'No member availability found.' })
        }

        res.status(200).json(memberAvailability)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: 'Server error while getting member availability for all concerts.',
        })
    }
}

const createConcert = async (req, res) => {
    const {
        id_orchestra,
        name,
        date,
        time,
        place,
        reservation_url,
        description,
        graphic,
    } = req.body

    try {
        // check if the orchestra exists
        const orchestraExistance =
            await Orchestra_OrchestraOrchestraMember_Owner_Model.getOrchestraById(
                id_orchestra
            )
        if (!orchestraExistance) {
            return res.status(404).json({ msg: 'Orchestra not found' })
        }

        const concert = await ConcertModel.createConcert(
            id_orchestra,
            name,
            date,
            time,
            place,
            description,
            reservation_url,
            graphic
        )
        if (!concert) {
            return res
                .status(500)
                .json({ msg: 'Failed to create new concert.' })
        }

        res.status(201).json(concert)
    } catch (err) {
        res.status(500).json({
            msg: 'Server error while creating concert.',
        })
    }
}

const createOrUpdateMemberAvailability = async (req, res) => {
    const id_orchestra_member = req.user.id
    const { id_concert, is_available } = req.body

    console.log('id_orchestra_member', id_orchestra_member)
    console.log('id_concert', id_concert)
    console.log('is_available', is_available)
    try {
        // check if the orchestra member exists
        const orchestraMember =
            await OrchestraMemberModel.getOrchestraMemberById(
                id_orchestra_member
            )
        if (!orchestraMember) {
            return res.status(404).json({ msg: 'Orchestra member not found.' })
        }

        // check if the concert exists
        const concert = await ConcertModel.getConcertById(id_concert)
        if (!concert) {
            return res.status(404).json({ msg: 'Concert not found.' })
        }

        // check if the member availability exists
        const memberAvailability = await ConcertModel.getMemberAvailability(
            id_orchestra_member,
            id_concert
        )
        if (!memberAvailability) {
            // if the member availability does not exist, create a new one
            const newMemberAvailability =
                await ConcertModel.createMemberAvailability(
                    id_orchestra_member,
                    id_concert,
                    is_available
                )

            if (!newMemberAvailability) {
                return res
                    .status(500)
                    .json({ msg: 'Failed to create member availability.' })
            }
            return res.status(201).json(newMemberAvailability)
        } else if (memberAvailability.is_available !== is_available) {
            // if the member availability exists and the value is different, update it
            const updatedMemberAvailability =
                await ConcertModel.updateMemberAvailability(
                    id_orchestra_member,
                    id_concert,
                    is_available
                )

            if (!updatedMemberAvailability) {
                return res
                    .status(500)
                    .json({ msg: 'Failed to update member availability.' })
            }
            return res.status(200).json(updatedMemberAvailability)
        } else {
            // if the member availability exists and the value is the same, return it
            return res.status(200).json(memberAvailability)
        }
    } catch (err) {
        res.status(500).json({
            msg: 'Server error while creating or updating member availability.',
        })
    }
}

module.exports = {
    getAllConcerts,
    getMemberAvailabilityAllConcerts,
    createConcert,
    createOrUpdateMemberAvailability,
}
