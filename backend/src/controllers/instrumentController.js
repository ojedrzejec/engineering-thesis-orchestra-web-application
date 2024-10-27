const InstrumentModel = require('../models/InstrumentModel')


const deleteInstrumentsByOrchestraMemberId = async (orchestraMemberId) => {
    try {
        await InstrumentModel.deleteInstrumentsByOrchestraMemberId(
            orchestraMemberId
        )
    } catch (err) {
        console.error('Error deleting instruments:', err)
    }
}

module.exports = {
    deleteInstrumentsByOrchestraMemberId,
}
