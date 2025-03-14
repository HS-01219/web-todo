var express = require('express');
var router = express.Router();

const { 
    createWork, 
    getWorks, 
    updateWork,
    deleteWork 
} = require("../controller/workController");

router.route('/')
    .get(getWorks)
    .post(createWork)
    .put(updateWork);

router.delete('/:id', deleteWork);

module.exports = router;

