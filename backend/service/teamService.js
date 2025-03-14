const pool = require("../db/mariadb");

const createTeam = async (name) => {
    // 만든 사람을 member 테이블에 insert하도록 수정필요
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
    // 팀 삭제 시 해당 팀의 멤버도 삭제하는 로직 추가 예정
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