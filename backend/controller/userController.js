const conn = require("../db/mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();

const join = (req, res) => {
    const {loginId, pwd} = req.body;

    if(!loginId || !pwd) {
        return res.status(StatusCodes.BAD_REQUEST).end();
    }

    // 이미 가입한 이메일인지 체크 필요

    const salt = crypto.randomBytes(10).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(pwd, salt, 10000, 10, 'sha512').toString('base64');

    const sql = `INSERT INTO users (login_id, password, salt) VALUES (?, ?, ?)`;
    const values = [loginId, hashPassword, salt];
    conn.query(
        sql, values, function(err, result) {
            if(err) {
                console.log(err)
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
            }
            console.log("return")
            return res.status(StatusCodes.CREATED).json(result);
        }
    );
}

const login = (req, res) => {
    const {loginId, pwd} = req.body;
    const sql = `SELECT * FROM users WHERE login_id = ?`;
    conn.query(
        sql, loginId, function(err, result) {
            if(err) {
                console.log(err)
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
            }

            const loginUser = result[0];
            const hashPassword = crypto.pbkdf2Sync(pwd, loginUser.salt, 10000, 10, 'sha512').toString('base64'); 

            if(loginUser && loginUser.password == hashPassword) {
                const token = jwt.sign({ loginId : loginUser.login_id }, process.env.PRIVATE_KEY, { expiresIn : '1h', issuer : "hs" });
                res.cookie("token", token, { httpOnly : true, secure : true });
                console.log(token);
                
                return res.status(StatusCodes.OK).json(result);
            } else {
                return res.status(StatusCodes.UNAUTHORIZED).end();
            }
        }
    );
}


module.exports = { join, login };