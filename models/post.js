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
            },
		instanceMethods: {
		  toJSON: function (models) {
			var values = this.get();
			if (this.Readbook) {
				var Comment = sequelize.models.Comment;
				if(Comment.findOne({"where": {'PostId': this.get('id')}}) == null) {
					values.lastcomment = Comment.findOne({"where": {'PostId': this.get('id')}}); 
				}
				else {
					values.lastcomment = "코멘트가 없습니다."
				}
                delete values.Readbook
			}
			return values;
		  }
		}
	});
    return Post;
};

