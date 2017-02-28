module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Book', {
		title: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'title',
		},
		isbn13: {
			type: DataTypes.STRING,
			field: 'isbn13',
		},
		raw: {
			type: DataTypes.JSON,
			field: 'raw',
		}
    });
};
