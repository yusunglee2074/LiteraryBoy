const sequelize = require('./index')

module.exports = function(sequelize, DataTypes) {
	const Book = sequelize.define('book', {
		title: {
			type: sequelize.STRING,
			allowNull: False,
			field: 'title',
		},
		page: {
			type: sequelize.INTEGER,
			field: 'page',
		},
		booksummary: {
			type: sequelize.TEXT,
			field: 'summary',
		},
		tableofcontents: {
			type: sequelize.TEXT,
			field: 'contents',
		},
		author: {
			type: sequelize.STRING,
			field: 'author',
		},
		publisher: {
			type: sequelize.STRING,
			field: 'publisher',
		},
		thumbnailimage: {
			type: sequelize.STRING,
			field: 'thumbnail_image_path'
		}
		} 
	);
	return ReadBook
};
