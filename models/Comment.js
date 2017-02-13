const sequelize = require('.index');

module.exports = function(sequelize, DataTypes) {
	const Comment = sequelize.define('comment', {
		text: {
			type: Sequelize.STRING,
			allowNull: False,
			field: 'comment',
			validate: {
				len: [1,150],
			    },
		},
		bookpage: {
			type: Sequelize.INTEGER,
			field: 'page',
		},
		reminddate: {
			type: Sequlize.DATE,
			field: 'remind_date',
		},
	}, {
		classMethods: {
			associate: function(models) {
				Comment.hasOne(User, {as: 'comment_userid'}),
				Comment.hasOne(Book, {as: 'comment_bookid'}),
				Comment.hasOne(HashTag, {as: 'comment_hastag'})
			},
		};
	});
	return Comment;
};
