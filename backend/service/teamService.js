const pool = require("../db/mariadb");

const createTeam = async (name) => {
    const sql = `INSERT INTO teams (name) VALUES (?)`;

    const connection = await pool.getConnection();
    try {
        const [results] = await connection.query(sql, name);
        return results;
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
};

const getTeams = async (userId) => {
    const sql = `SELECT T.id, T.name FROM teams T LEFT JOIN members M ON T.id = M.team_id WHERE M.user_id = ?`;
    
    const connection = await pool.getConnection();
    try {
        const [results] = await connection.query(sql, userId);
        return results;
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
};

const deleteTeam = async (id) => {
    const sql = `DELETE FROM teams WHERE id = ?`;

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

module.exports = { 
    createTeam, 
    getTeams, 
    deleteTeam 
};