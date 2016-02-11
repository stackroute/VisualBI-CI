var env = process.env.NODE_ENV;

var envCfg = require('./environment/'+env);

module.exports = envCfg;