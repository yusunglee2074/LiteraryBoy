const sequelize = require('.index');

module.exports = function(sequelize, DataTypes) {
	const HashTag = sequelize.define('hashtag', {
		text: {
			type: Sequelize.STRING,
			field: 'comment',
			validate: {
			    len[1,20],
			},
		},
	}, {
		classMethods: {
			associate: function(models) {
				HashTag.hasMany(User, {as: 'hashtag_user'})
			};
		};
	});
	return HashTag;
};
