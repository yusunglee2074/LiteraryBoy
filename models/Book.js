const sequelize = require('./index')

module.exports = function(sequelize, DataTypes) {
	const Book = sequelize.define('book', {
		title: {
			type: Sequelize.STRING,
			allowNull: False,
			field: 'title',
		},
		page: {
			type: Sequelize.INTEGER,
			field: 'page',
		},
		booksummary: {
			type: Sequelize.TEXT,
			field: 'summary',
		},
		tableofcontents: {
			type: Sequelize.TEXT,
			field: 'contents',
		},
		author: {
			type: Sequelize.STRING,
			field: 'author',
		},
		publisher: {
			type: Sequelize.STRING,
			field: 'publisher',
		},
		thumbnailimage: {
			type: Sequelize.STRING,
			field: 'thumbnail_image_path'
		}
		} 
	);
	return ReadBook
};
