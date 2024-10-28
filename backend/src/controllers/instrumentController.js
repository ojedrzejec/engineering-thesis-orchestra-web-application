const InstrumentModel = require('../models/InstrumentModel')

const getAllInstruments = async (req, res) => {
    try {
        const instruments = await InstrumentModel.getAllInstruments()
        if (!instruments.length) {
            return res.status(404).json({ msg: 'No instruments found.' })
        }
        res.status(200).json(instruments)
    } catch (err) {
        res.status(500).json({
            msg: 'Server error while getting all instruments.',
        })
    }
}

const getAllInstrumentsWithoutRepeatingTheirNames = async (req, res) => {
    try {
        const instruments = await InstrumentModel.getAllInstrumentsDistincted()
        if (!instruments.length) {
            return res.status(404).json({ msg: 'No instruments found.' })
        }
        res.status(200).json(instruments)
    } catch (err) {
        res.status(500).json({
            msg: 'Server error while getting all instruments distincted.',
        })
    }
}

//  fetch instruments associated with a specific orchestra member
const getInstrumentsForUser = async (req, res) => {
    const { id } = req.params
    try {
        const instrument = await InstrumentModel.getInstrumentsByMemberId(id)
        console.log(instrument)
        if (!instrument.length) {
            return res
                .status(404)
                .json({ msg: 'No instruments found for the user.' })
        }
        res.status(200).json(instrument)
    } catch (err) {
        res.status(500).json({
            msg: 'Server error while getting instrument for user.',
        })
    }
}

// update all records matching the given name to a new name
const updateAllInstrumentsNames = async (req, res) => {
    const { currentName, newName } = req.body
    try {
        const updatedInstruments =
            await InstrumentModel.updateAllInstrumentsByName(
                currentName,
                newName
            )
        if (!updatedInstruments.length) {
            return res
                .status(404)
                .json({ msg: 'No instruments found to update.' })
        }
        res.status(200).json(updatedInstruments)
    } catch (err) {
        res.status(500).json({
            msg: 'Server error while updating instruments.',
        })
    }
}

// delete all records matching the given name
const deleteInstrumentsByName = async (req, res) => {
    const { name } = req.body
    try {
        const deletedInstruments =
            await InstrumentModel.deleteAllInstrumentsByName(name)
        if (!deletedInstruments.length) {
            return res
                .status(404)
                .json({ msg: 'No instruments found to delete.' })
        }
        res.status(200).json({
            msg: 'Instruments deleted successfully!',
            deletedInstruments,
        })
    } catch (err) {
        res.status(500).json({
            msg: 'Server error while deleting instruments.',
        })
    }
}

const addInstrumentWithoutMember = async (req, res) => {
    const { instrumentName } = req.body
    try {
        const newInstrument =
            await InstrumentModel.createInstrumentWithoutMember(instrumentName)
        res.status(201).json(newInstrument)
    } catch (err) {
        res.status(500).json({ msg: 'Server error while adding instrument.' })
    }
}

const addInstrumentWithMember = async (req, res) => {
    const orchestraMemberId = req.params.id
    const { instrumentName } = req.body
    try {
        const newInstrument = await InstrumentModel.createInstrumentWithMember(
            orchestraMemberId,
            instrumentName
        )
        res.status(201).json(newInstrument)
    } catch (err) {
        res.status(500).json({ msg: 'Server error while adding instrument.' })
    }
}

// const updateUserInstruments = async (req, res) => {
//     const { orchestraMemberId } = req.params
//     const { instrumentNames } = req.body // Expecting an array of instrument names

//     try {
//         await InstrumentModel.updateOrchestraMemberInstruments(
//             orchestraMemberId,
//             instrumentNames
//         )
//         res.status(200).json({ msg: 'Instruments updated successfully' })
//     } catch (err) {
//         res.status(500).json({ msg: 'Server error while updating instruments' })
//     }
// }

// const patchUserInstruments = async (req, res) => {
//     const { orchestraMemberId } = req.params
//     const { instrumentNames } = req.body // Expecting an array of instrument names

//     try {
//         await InstrumentModel.patchOrchestraMemberInstruments(
//             orchestraMemberId,
//             instrumentNames
//         )
//         res.status(200).json({ msg: 'Instruments patched successfully' })
//     } catch (err) {
//         res.status(500).json({ msg: 'Server error while patching instruments' })
//     }
// }

const deleteInstrumentsByOrchestraMemberId = async (req, res) => {
    const { id } = req.params
    try {
        await InstrumentModel.deleteInstrumentsByOrchestraMemberId(id)
    } catch (err) {
        console.error('Error deleting instruments:', err)
    }
}

module.exports = {
    getAllInstruments,
    getAllInstrumentsWithoutRepeatingTheirNames,
    getInstrumentsForUser,
    updateAllInstrumentsNames,
    deleteInstrumentsByName,
    addInstrumentWithoutMember,
    addInstrumentWithMember,
    // updateUserInstruments,
    // patchUserInstruments,
    deleteInstrumentsByOrchestraMemberId,
}
