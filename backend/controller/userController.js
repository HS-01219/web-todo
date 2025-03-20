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
            return res.status(StatusCodes.CONFLICT).json({ message : "이미 존재하는 아이디입니다." });
        }

        await userService.joinUser(loginId, pwd);
        return res.status(StatusCodes.CREATED).end();
    } catch(err) {
        console.log(err)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message : "서버 에러가 발생했습니다." });
    }
}

const login = async (req, res) => {
    const {loginId, pwd} = req.body;

    try {
        const loginUser = await userService.findUserByLoginId(loginId);

        if (!loginUser[0]) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message : "해당 아이디의 유저를 찾을 수 없습니다." });
        }

        const hashPassword = crypto.pbkdf2Sync(pwd, loginUser[0].salt, 10000, 10, 'sha512').toString('base64');
        if (loginUser[0].password === hashPassword) {
            // token 관련은 추후 업데이트
            // const token = jwt.sign({ loginId: loginUser.login_id }, process.env.PRIVATE_KEY, { expiresIn: '1h', issuer: "hs" });
            // res.cookie("token", token, { httpOnly: true, secure: true });
            // console.log(token);
            return res.status(StatusCodes.OK).json(loginUser[0]);
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message : "비밀번호가 일치하지 않습니다." });
        }
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message : "서버 에러가 발생했습니다." });
    }
}


module.exports = { join, login };