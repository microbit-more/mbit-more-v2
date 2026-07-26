const fs = require('node:fs');
const path = require('node:path');

module.exports = {
  cert: fs.readFileSync(path.join(__dirname, 'localhost.pem')),
  key: fs.readFileSync(path.join(__dirname, 'localhost-key.pem'))
};
