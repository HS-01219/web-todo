const pool = require("../db/mariadb");

const inviteMember = async (teamId, userId) => {
    const sql = `INSERT INTO members (team_id, user_id) VALUES (?, ?)`;
    const values = [teamId, userId];

    const connection = await pool.getConnection();
    try {
        const [results] = await connection.query(sql, values);
        return results;
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
};

const getMembers = async (teamId) => {
    const sql = `SELECT M.*, U.login_id FROM members M LEFT JOIN users U ON M.user_id = U.id WHERE team_id = ?`;

    const connection = await pool.getConnection();
    try {
        const [results] = await connection.query(sql, teamId);
        return results;
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
};

const deleteMember = async (id) => {
    const sql = `DELETE FROM members WHERE id = ?`;

    const connection = await pool.getConnection();
    try {
        const [results] = await connection.query(sql, id);
        return results;
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
};

const deleteTeamMember = async (teamId) => {
    const sql = `DELETE FROM members WHERE team_id = ?`;

    const connection = await pool.getConnection();
    try {
        const [results] = await connection.query(sql, teamId);
        return results;
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = { 
    inviteMember, 
    getMembers, 
    deleteMember,
    deleteTeamMember
};
