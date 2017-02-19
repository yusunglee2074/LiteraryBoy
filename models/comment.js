module.exports = function(sequelize, DataTypes) {
    var Comment = sequelize.define('Comment', {
		// primary key가 없으면 자동으로 id 칼럼을 생성하고 primary key로 삼는다.
		// createdAt, updatedAt 자동으로 생성된다.

		content: {
			type: DataTypes.TEXT,
			field: 'content',
		},
	},  {
		classMethods: {
			associate: function(models) {
				Comment.belongsToMany(models.Hashtag, {through: 'comment_hash'}),
				Comment.belongsTo(models.User),
				Comment.belongsTo(models.Post)
				}
			}
		});
	return Comment;
};
