const { StatusCodes } = require("http-status-codes");
const memberService = require("../service/memberService");
const userService = require("../service/userService");

const inviteMember = async (req, res) => {
    const { teamId, loginId } = req.body;

    try {
        const user = await userService.findUserByLoginId(loginId);
        if(!user[0]){
            return res.status(StatusCodes.NOT_FOUND).json({ message : "해당 아이디의 유저를 찾을 수 없습니다."});
        }
        
        await memberService.inviteMember(teamId, user[0].id);
        return res.status(StatusCodes.CREATED).end();
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
}

const getMembers = async (req, res) => { 
    const { teamId } = req.query;

    try {
        const results = await memberService.getMembers(teamId);
        return res.status(StatusCodes.OK).json(results);
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
}

const deleteMember = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await memberService.deleteMember(id);
        if(!result.affectedRows) {
            return res.status(StatusCodes.NO_CONTENT).end();
        }
        return res.status(StatusCodes.OK).end();
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
}

module.exports = { 
    inviteMember, 
    getMembers, 
    deleteMember
};