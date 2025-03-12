var express = require('express');
var router = express.Router();

const { 
    createWork, 
    getWorks, 
    updateWorkStatus, 
    updateWorkName, 
    deleteWork 
} = require("../controller/workController");

router.route('/')
    .get(getWorks)
    .post(createWork)
    .put(updateWorkStatus);

router.route('/:id')
    .delete(deleteWork)
    .put(updateWorkName);

module.exports = router;

