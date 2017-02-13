const sequelize = require('./index');

module.exports = function(sequelize, DataTypes) {
	const CommentHash = sequelize.define('comment_hash', {
        Role: Sequelize.STRING
	});
    Comment.belongsToMany(Hash, { through: CommentHash, foreignKey: "hash_id"});
    Hash.belongsToMany(Comment, { through: CommentHash, foreignKey: "comment_id"});
	return CommentHash;
};
