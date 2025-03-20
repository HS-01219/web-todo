const { StatusCodes } = require("http-status-codes");
const memberService = require("../service/memberService");

const inviteMember = async (req, res) => {
    const { teamId, userId } = req.body;

    try {
        await memberService.inviteMember(teamId, userId);
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