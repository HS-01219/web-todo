const pool = require("../db/mariadb");

const createWork = async (name, userId, teamId) => {
    const sql = `INSERT INTO works (name, user_id, team_id) VALUES (?, ?, ?)`;
    const values = [name, userId, teamId];

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

const getWorks = async (userId, teamId, state) => {
    let sql = `SELECT * FROM works`;
    let values = [];
    if (userId) {
        sql += ` WHERE user_id = ?`; 
        values.push(userId);
    }

    if (teamId) {
        sql += ` WHERE team_id = ?`; 
        values.push(teamId);
    }

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

const updateWork = async (id, name, state) => {
    let sql = '';
    const values = [];
    
    if (name) {
        sql = `UPDATE works SET name = ? WHERE id = ?`;
        values.push(name, id);
    } else if (state) {
        sql = `UPDATE works SET state = ? WHERE id = ?`;
        values.push(state, id);
    }

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

const deleteWork = async (id) => {
    const sql = `DELETE FROM works WHERE id = ?`;

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

const deleteTeamWorks = async (teamId) => {
    const sql = `DELETE FROM works WHERE team_id = ?`;

    const connection = await pool.getConnection();
    try {
        const [results] = await connection.query(sql, teamId);
        return results;
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }

}

module.exports = { 
    createWork, 
    getWorks, 
    updateWork, 
    deleteWork,
    deleteTeamWorks
};
