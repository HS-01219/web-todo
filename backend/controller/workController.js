const { StatusCodes } = require("http-status-codes");
const workService = require("../service/workService");

const createWork = async (req, res) => {
    const { userId = null, teamId = null, name } = req.body;

    try {
        await workService.createWork(name, userId, teamId);
        return res.status(StatusCodes.CREATED).end();
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
}

const getWorks = async (req, res) => {
    const { userId, teamId, state } = req.query;

    try {
        const results = await workService.getWorks(userId, teamId, state);
        return res.status(StatusCodes.OK).json(results);
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
}

const updateWork = async (req,res) => {
    const { id, name, state } = req.body;

    try {
        const result = await workService.updateWork(id, name, state);
        if(!result.affectedRows) {
            return res.status(StatusCodes.NO_CONTENT).end();
        }
        return res.status(StatusCodes.OK).end();
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
}

const deleteWork = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await workService.deleteWork(id);
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
    createWork, 
    getWorks, 
    updateWork, 
    deleteWork 
};