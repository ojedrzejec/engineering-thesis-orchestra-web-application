const getOrchestraMembers = 'SELECT * FROM orchestra_member';
const getOrchestraMemberById = 'SELECT * FROM orchestra_member WHERE id = $1';

module.exports = {
    getOrchestraMembers,
    getOrchestraMemberById,
}
