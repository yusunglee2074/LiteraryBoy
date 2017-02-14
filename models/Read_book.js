const sequelize = require('./index')
const sequelize = require('./Book')

module.exports = function(sequelize, DataTypes) {
	const ReadBook = sequelize.define('readbook', {
		readstartdate: {
			type: Sequelize.DATE,
			field: 'read_start_date',
		},
		readenddate: {
			type: Sequelize.DATE,
			field: 'read_end_date',
		},
    }, {
		classMethods: {
			associate: function(models) {
				// 유저 칼럼 추가
				ReadBook.belongsTo(Book),
				ReadBook.belongsTo(User)
			},
		}
	});
	return ReadBook
};
