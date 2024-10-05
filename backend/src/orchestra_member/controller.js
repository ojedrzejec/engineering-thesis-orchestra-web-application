const pool = require('../../config/database');
const queries = require('./queries');

const getOrchestraMembers = (req, res) => {
    console.log('getOrchestraMembers');
    pool.query(queries.getOrchestraMembers, (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

module.exports = {
    getOrchestraMembers,
};
