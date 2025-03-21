const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { errorValidate, validateEitherOne } = require('../middleware/validator');

const { 
    createWork, 
    getWorks, 
    updateWork,
    deleteWork 
} = require("../controller/workController");

router.route('/')
    .get([validateEitherOne(['userId', 'teamId']) 
        , errorValidate], getWorks)
    .post([validateEitherOne(['userId', 'teamId'])
        , check('name', 'name is Empty').notEmpty()
        , errorValidate], createWork)
    .put([validateEitherOne(['name', 'state']) 
        , errorValidate], updateWork);

router.delete('/:id', deleteWork);

module.exports = router;

