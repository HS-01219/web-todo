const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { errorValidate } = require('../middleware/validator');

const { join, login } = require('../controller/userController');


router.post('/join'
        , [check('loginId', 'loginId is Empty').notEmpty()
        , check('pwd', 'pwd is Empty').notEmpty()
        , errorValidate]
        , join);

router.post('/login'
        , [check('loginId', 'loginId is Empty').notEmpty()
            , check('pwd', 'pwd is Empty').notEmpty()
            , errorValidate]
        , login);

module.exports = router;
