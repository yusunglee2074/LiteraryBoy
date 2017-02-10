const sequelize = require('.index')

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
				// ReadBook에게 bookid라는 속성이 생긴다.
				ReadBook.belongsTo(Book)
			},
		}
	});
	return ReadBook
};
