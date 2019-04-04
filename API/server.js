'use strict';

const app = require('./src/app');
const port = 3000;

app.listen(port, () => {
  console.log(`app running on port ${port}`);
});