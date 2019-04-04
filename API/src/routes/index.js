const express = require("express");
const router = express.Router();

const erc20Route = require('./erc20');

router.use('/erc20', erc20Route);

module.exports = router;
