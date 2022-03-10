'use strict';

const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

const scripts = [];

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    delete require.cache[require.resolve(path.join(__dirname, file))];
    const script = require(path.join(__dirname, file));
    scripts.push(script);
  });

module.exports = scripts;
