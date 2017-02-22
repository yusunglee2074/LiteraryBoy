module.exports = function(sequelize, DataTypes) {
    var Post = sequelize.define('Post', {
        content: {
            type: DataTypes.TEXT,
            field: 'content',
        },
        likecount: {
            type: DataTypes.INTEGER,
            field: 'like_count',
        },
        imagepath: {
            type: DataTypes.STRING,
            field: 'image_path',
        },
        theme: {
            type: DataTypes.STRING,
            field: 'theme',
        },
        page: {
            type: DataTypes.INTEGER,
            field: 'page',
        },
    },  {
        classMethods: {
            associate: function(models) {
                Post.belongsToMany(models.Hashtag, {through: 'post_hash'}),
                Post.belongsTo(models.User),
				Post.belongsTo(models.Readbook)
                }
            }
        });
    return Post;
};

