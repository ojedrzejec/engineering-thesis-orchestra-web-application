const ConcertModel = require('../models/ConcertModel')
const Orchestra_OrchestraOrchestraMember_Owner_Model = require('../models/OrchestraModel_OrchestraOrchestraMember_OWNER')

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

module.exports = {
    getAllConcerts,
    createConcert,
}
