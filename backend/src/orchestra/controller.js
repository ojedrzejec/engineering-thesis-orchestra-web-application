const pool = require('../../config/database');

const getOrchestras = (req, res) => {
    console.log('getOrchestra');
    pool.query('SELECT * FROM orchestra', (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

module.exports = {
    getOrchestras,
};
