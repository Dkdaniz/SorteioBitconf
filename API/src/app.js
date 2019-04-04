const express = require("express");
const bodyParser = require('body-parser');
const routes =  require ('./routes');

const app = express();
const cors = require('cors');

app.use(bodyParser.json({limit: '50mb'}));
app.use(cors());
app.use('/api', routes);

module.exports = app;