const conn = require("../db/mariadb");
const { StatusCodes } = require("http-status-codes");

const inviteMember = (req, res) => {
    const { teamId, userId } = req.body;
    const sql = `INSERT INTO members (team_id, user_id) VALUES (?,?)`;
    const values = [teamId, userId];
    conn.query(
        sql, values, function(err, results) {
            if(err) {
                console.log(err)
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
            }
            return res.status(StatusCodes.CREATED).json(results);
        }
    );
}

const getMembers = (req, res) => {
    const { teamId } = req.query;

    let sql = `SELECT M.*, U.login_id FROM members M LEFT JOIN users U ON M.user_id = U.id WHERE team_id = ?`;
    
    conn.query(
        sql, teamId, function(err, results) {
            if(err) {
                console.log(err);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
            }
            return res.status(StatusCodes.OK).json(results)
        }
    );
}

const deleteMember = (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM members WHERE id = ?`;

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
    inviteMember, 
    getMembers, 
    deleteMember
};