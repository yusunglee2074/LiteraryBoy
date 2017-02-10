var Sequelize = require('sequelize')

// 로컬 DB 연결
var sequelize = new Sequelize('book', 'postgres', '3030', {
	host: 'localhost',
	dialect: 'postgres',

	pool: {
		max: 5,
		min: 0,
		idle: 10000
	},
});


module.exports = sequelize;
