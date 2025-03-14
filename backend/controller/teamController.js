const conn = require("../db/mariadb");
const { StatusCodes } = require("http-status-codes");

const createTeam = (req, res) => {
    // 만든 사람을 member 테이블에 insert하도록 수정필요
    const { name } = req.body;
    const sql = `INSERT INTO teams (name) VALUES (?)`;
    conn.query(
        sql, name, function(err, results) {
            if(err) {
                console.log(err)
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
            }
            return res.status(StatusCodes.CREATED).json(results);
        }
    );
}

const getTeams = (req, res) => {
    const { userId } = req.query;

    let sql = `SELECT T.id, T.name FROM teams T LEFT JOIN members M ON T.id = M.team_id WHERE M.user_id = ?`;
    
    conn.query(
        sql, userId, function(err, results) {
            if(err) {
                console.log(err);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
            }
            return res.status(StatusCodes.OK).json(results)
        }
    );
}

const deleteTeam = (req, res) => {
    // 팀 삭제할 때 해당 팀 멤버도 삭제하는 내용 추가 예정
    const { id } = req.params;
    const sql = `DELETE FROM teams WHERE id = ?`;

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
    createTeam, 
    getTeams, 
    deleteTeam
};