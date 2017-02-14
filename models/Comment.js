const sequelize = require('./index');
const User = require('./User');
const Book = require('./Book');
const HashTag = require('./HashTag');

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
				Comment.belongsToMany(HashTag, {through: "comment_hash"})
			},
		};
	});
	return Comment;
};
