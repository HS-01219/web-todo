const pool = require("../db/mariadb");
const crypto = require("crypto");

const joinUser = async (loginId, pwd) => {
    const salt = crypto.randomBytes(10).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(pwd, salt, 10000, 10, 'sha512').toString('base64');

    const sql = `INSERT INTO users (login_id, password, salt) VALUES (?, ?, ?)`;
    const values = [loginId, hashPassword, salt];
    
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

const findUserByLoginId = async (loginId) => {
    const sql = `SELECT * FROM users WHERE login_id = ?`;

    const connection = await pool.getConnection();
    try {
        const [results] = await connection.query(sql, loginId);
        return results;
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = {joinUser, findUserByLoginId}