var express = require('express');
var router = express.Router();

const { 
    inviteMember, 
    getMembers, 
    deleteMember
} = require("../controller/memberController");


router.route('/')
    .get(getMembers)
    .post(inviteMember)

router.delete('/:id', deleteMember);

module.exports = router;
