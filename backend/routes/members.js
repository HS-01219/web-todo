const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { errorValidate } = require('../middleware/validator');

const { 
    inviteMember, 
    getMembers, 
    deleteMember
} = require("../controller/memberController");


router.route('/')
    .get([check('teamId', 'teamId is Empty').notEmpty() 
        , errorValidate], getMembers)
    .post([check('teamId', 'teamId is Empty').notEmpty() 
        , check('userId', 'userId is Empty').notEmpty()
        , errorValidate], inviteMember)

router.delete('/:id', deleteMember);

module.exports = router;
