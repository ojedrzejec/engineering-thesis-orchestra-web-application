const pool = require('../../config/database');
const queries = require('./queries');

const getOrchestras = (req, res) => {
    console.log('getOrchestra');
    pool.query(queries.getOrchestras, (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

module.exports = {
    getOrchestras,
};
