const sequelize = require('./index');

module.exports = function(sequelize, DataTypes) {
	const Hash = sequelize.define('hash', {
		// primary key가 없으면 자동으로 id 칼럼을 생성하고 primary key로 삼는다.
		// createdAt, updatedAt 자동으로 생성된다.
		content: {
			type: Sequelize.STRING,
			field: 'content',
		}
	},	{
		classMethods: {
			associate: function(models) {
			},
		}
	});
	return Hash;
};
