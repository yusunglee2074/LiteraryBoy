const sequelize = require('./index');
const HashTag = require('./HashTag');

module.exports = function(sequelize, DataTypes) {
	const Comment = sequelize.define('comment', {
		// primary key가 없으면 자동으로 id 칼럼을 생성하고 primary key로 삼는다.
		// createdAt, updatedAt 자동으로 생성된다.

		parentCommentId: {
			type: Sequelize.INTEGER,
			allowNull: true,
			defaultValue: null,
			field: 'parent_comment_id',
		},
		content: {
			type: Sequelize.TEXT,
			field: 'content',
		},
		theme: {
			type: Sequelize.STRING,
			field: 'theme',
		},
		align: {
			type: Sequelize.STRING,
			field: 'align',
		},
		page: {
			type: Sequelize.INTEGER,
			field: 'page',
		},
		imagePath: {
			type: Sequelize.STRING,
			field: 'image_path',
		},
		isText: {
			type: Sequelize.BOOLEAN,
			defaultValue: true,
			field: 'is_text',
		},
		favorite: {
			type: Sequelize.BOOLEAN,
			field: 'favorite',
		}
	},	{
	}, {
		classMethods: {
			associate: function(models) {
				Comment.belongsToMany(HashTag, {through: "comment_hash"})
				},
			};
		}
	});
	return Comment;
};
