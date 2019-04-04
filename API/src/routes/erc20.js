const express = require("express");
const Erc20Controller = require("../controllers/erc20");

const router = express.Router();
const erc20Controller = new Erc20Controller();

router.post('/eth/recorder', (req, res) => erc20Controller._recorder(req, res));

module.exports = router;