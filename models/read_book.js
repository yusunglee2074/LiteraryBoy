module.exports = function(sequelize, DataTypes) {
	const Readbook = sequelize.define('Readbook', {
		readstartdate: {
			type: DataTypes.DATE,
			field: 'read_start_date',
		},
		readenddate: {
			type: DataTypes.DATE,
			field: 'read_end_date',
		},
    }, {
		classMethods: {
			associate: function(models) {
				// 유저 칼럼 추가
				Readbook.belongsTo(models.Book),
				Readbook.belongsTo(models.User)
			},
		}
	});
	return Readbook
};
