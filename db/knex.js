let connections = require('../knexfile');
module.exports = require('knex')(connections.development);