const sequelize = require('.index');
const User = require('.User');
const Comment = require('.Comment');

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
				HashTag.belogsToMany(Comment, {through: "comment_hash"})
			};
		};
	});
	return HashTag;
};
