const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { errorValidate } = require('../middleware/validator');

const { 
    createTeam, 
    getTeams, 
    deleteTeam
} = require("../controller/teamController");

router.route('/')
    .get([check('userId', 'userId is Empty').notEmpty() 
        , errorValidate], getTeams)
    .post([check('userId', 'userId is Empty').notEmpty() 
        , check('name', 'name is Empty').notEmpty()
        , errorValidate], createTeam)

router.delete('/:id', deleteTeam);

module.exports = router;
