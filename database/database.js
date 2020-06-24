const Sequelize = require('sequelize');
const connection = new Sequelize('ocean', 'root', 'yuriMELO123', {
	host: 'localhost',
	dialect: 'mysql',
	timezone: "-03:00"
});

module.exports = connection;