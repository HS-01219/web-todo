var express = require('express');
var router = express.Router();

const { join, login } = require("../controller/userController");

router.post('/join', join);
router.post('/login', login);

module.exports = router;
