module.exports = function(sequelize, DataTypes) {
	const Hashtag = sequelize.define('Hashtag', {
		text: {
			type: DataTypes.STRING,
			field: 'comment',
		},
	}, {
		classMethods: {
            associate: function(models) {
                Hashtag.belongsToMany(models.Comment, {through: 'comment_hash'})
                Hashtag.belongsToMany(models.Post, {through: 'post_hash'})
                }
            }
        });
	return Hashtag;
};
