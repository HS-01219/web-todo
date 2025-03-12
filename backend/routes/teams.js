var express = require('express');
var router = express.Router();

const { 
    createTeam, 
    getTeams, 
    deleteTeam
} = require("../controller/teamController");

router.route('/')
    .get(getTeams)
    .post(createTeam)

router.delete('/:id', deleteTeam);

module.exports = router;
