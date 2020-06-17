const Sequelize = require('sequelize');
const connection = new Sequelize('ocean', 'root', 'yuriMELO123', {
	host: 'localhost',
	dialect: 'mysql'
});

module.exports = connection;