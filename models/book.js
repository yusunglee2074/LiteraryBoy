module.exports = function(sequelize, DataTypes) {
	const Book = sequelize.define('Book', {
		title: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'title',
		},
		page: {
			type: DataTypes.INTEGER,
			field: 'page',
		},
		booksummary: {
			type: DataTypes.TEXT,
			field: 'summary',
		},
		tableofcontents: {
			type: DataTypes.TEXT,
			field: 'contents',
		},
		author: {
			type: DataTypes.STRING,
			field: 'author',
		},
		publisher: {
			type: DataTypes.STRING,
			field: 'publisher',
		},
		thumbnailimage: {
			type: DataTypes.STRING,
			field: 'thumbnail_image_path'
		}
		} 
	);
	return Book
};
