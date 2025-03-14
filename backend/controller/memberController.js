const { StatusCodes } = require("http-status-codes");
const memberService = require("../service/memberService")

const inviteMember = async (req, res) => {
    const { teamId, userId } = req.body;
    try {
        const result = await memberService.inviteMember(teamId, userId);
        return res.status(StatusCodes.CREATED).json(result);
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
        return res.status(StatusCodes.OK).json(result);
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