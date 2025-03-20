const { StatusCodes } = require("http-status-codes");
const teamService = require("../service/teamService");
const memberService = require("../service/memberService");
const workService = require("../service/workService");

const createTeam = async (req, res) => {
    const { name, userId } = req.body;

    try {
        const result = await teamService.createTeam(name);
        await memberService.inviteMember(result.insertId, userId);
        return res.status(StatusCodes.CREATED).json({
            "id" : result.insertId,
            "name" : name
        });
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
}

const getTeams = async (req, res) => {
    const { userId } = req.query;

    try {
        const results = await teamService.getTeams(userId);
        return res.status(StatusCodes.OK).json(results);
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
}

const deleteTeam = async (req, res) => {
    const { id } = req.params;

    try {
        await workService.deleteTeamWorks(id);
        await memberService.deleteTeamMember(id);
        await teamService.deleteTeam(id);
        return res.status(StatusCodes.OK).end();
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
}

module.exports = { 
    createTeam, 
    getTeams, 
    deleteTeam
};