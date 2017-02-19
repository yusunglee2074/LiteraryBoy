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
    },  {
        classMethods: {
            associate: function(models) {
                Comment.belongsToMany(models.Hashtag, {through: 'post_hash'}),
                Comment.belongsTo(models.User),
                }
            }
        });
    return Comment;
};

