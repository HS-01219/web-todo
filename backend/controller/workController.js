const conn = require("../db/mariadb");
const { StatusCodes } = require("http-status-codes");

const createWork = (req, res) => {
    const { userId = null, teamId = null, name } = req.body;
    const sql = `INSERT INTO works (name, user_id, team_id) VALUES (?, ?, ?)`;
    const values = [name, userId, teamId];
    conn.query(
        sql, values, function(err, result) {
            if(err) {
                console.log(err)
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
            }
            return res.status(StatusCodes.CREATED).json(result);
        }
    );
}

const getWorks = (req, res) => {
    const { userId, teamId, state } = req.query;
    const values = [];

    let sql = `SELECT * FROM works`;
    if(userId) {
        sql += ` WHERE user_id = ?`; 
        values.push(userId);
    }

    if(teamId) {
        sql += ` WHERE team_id = ?`; 
        values.push(teamId);
    }
    
    sql += ` AND state = ?`;
    values.push(state);

    conn.query(
        sql, values, function(err, results) {
            if(err) {
                console.log(err);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
            }
            return res.status(StatusCodes.OK).json(results)
        }
    );
}

const updateWork = (req,res) => {
    const { id, name, state } = req.body;

    let sql = '';
    const values = [];

    if(name) {
        sql = `UPDATE works SET name = ? WHERE id = ?`;
        values.push(name, id);
    } else if(state) {
        sql = `UPDATE works SET state = ? WHERE id = ?`;
        values.push(state, id);
    }

    if(sql) {
        conn.query(
            sql, values, function(err, results) {
                if(err) {
                    console.log(err);
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
                }
                return res.status(StatusCodes.OK).json(results)
            }
        );
    } else {
        return res.status(StatusCodes.BAD_REQUEST).end();
    }

}

const deleteWork = (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM works WHERE id = ?`;

    conn.query(
        sql, id, function(err, results) {
            if(err) {
                console.log(err);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
            }
            return res.status(StatusCodes.OK).json(results)
        }
    );
}

module.exports = { 
    createWork, 
    getWorks, 
    updateWork, 
    deleteWork 
};