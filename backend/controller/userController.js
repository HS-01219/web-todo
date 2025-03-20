const { StatusCodes } = require("http-status-codes");
// const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userService = require("../service/userService");
const dotenv = require("dotenv");
dotenv.config();

const join = async (req, res) => {
    const {loginId, pwd} = req.body;
    
    try {
        const loginUser = await userService.findUserByLoginId(loginId);
        if(loginUser.length > 0) {
            return res.status(StatusCodes.CONFLICT).end();
        }

        await userService.joinUser(loginId, pwd);
        return res.status(StatusCodes.CREATED).end();
    } catch(err) {
        console.log(err)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
}

const login = async (req, res) => {
    const {loginId, pwd} = req.body;

    try {
        const loginUser = await userService.findUserByLoginId(loginId);

        if (!loginUser[0]) {
            return res.status(StatusCodes.UNAUTHORIZED).end();
        }

        const hashPassword = crypto.pbkdf2Sync(pwd, loginUser[0].salt, 10000, 10, 'sha512').toString('base64');
        if (loginUser[0].password === hashPassword) {
            // token 관련은 추후 업데이트
            // const token = jwt.sign({ loginId: loginUser.login_id }, process.env.PRIVATE_KEY, { expiresIn: '1h', issuer: "hs" });
            // res.cookie("token", token, { httpOnly: true, secure: true });
            // console.log(token);
            return res.status(StatusCodes.OK).json(loginUser[0]);
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).end();
        }
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
}


module.exports = { join, login };