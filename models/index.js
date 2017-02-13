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

// 각각의 모델들을 db변수에 넣어서 export한다.

const fs = require('fs');
const path = require('path');

let db = {};

fs
    .readdirSync(__dirname)
	.filter(function(file) {
		return (file.indexOf(".") !== 0) && (file !== 'index.js');
	})
	.forEach(function(file) {
		var model = sequelize.import(path.join(__dirname, file));
		db[model.name] = model;
	});

Object.keys(db).forEach(function(modelName) {
	if ("associate" in db[modelName]) {
		db[modeName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = sequelize;
module.exports = db;
