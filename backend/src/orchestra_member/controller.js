const pool = require('../../config/database');

const getOrchestraMembers = (req, res) => {
    console.log('getOrchestraMembers');
    pool.query('SELECT * FROM orchestra_member', (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

module.exports = {
    getOrchestraMembers,
};
