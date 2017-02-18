module.exports = function(sequelize, DataTypes) {
    var Comment = sequelize.define('Comment', {
		// primary key가 없으면 자동으로 id 칼럼을 생성하고 primary key로 삼는다.
		// createdAt, updatedAt 자동으로 생성된다.

		parentCommentId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: null,
			field: 'parent_comment_id',
		},
		content: {
			type: DataTypes.TEXT,
			field: 'content',
		},
		theme: {
			type: DataTypes.STRING,
			field: 'theme',
		},
		align: {
			type: DataTypes.STRING,
			field: 'align',
		},
		page: {
			type: DataTypes.INTEGER,
			field: 'page',
		},
		imagePath: {
			type: DataTypes.STRING,
			field: 'image_path',
		},
		isText: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
			field: 'is_text',
		},
		favorite: {
			type: DataTypes.BOOLEAN,
			field: 'favorite',
		}
	},  {
		classMethods: {
			associate: function(models) {
				Comment.belongsToMany(models.Hashtag, {through: 'comment_hash'})
				}
			}
		});
	return Comment;
};
