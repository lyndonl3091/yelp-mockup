'use strict';

const express = require('express');

let router = express.Router();


router.use('/users', require('./users'));
router.use('/businesses', require('./businesses'));


module.exports = router;
