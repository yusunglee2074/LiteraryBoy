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
		isbn: {
			type: DataTypes.INTEGER,
			field: 'isbn_13',
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
		highimage: {
			type: DataTypes.STRING,
			field: 'high_image_path',
		},
		published_date: {
			type: DataTypes.DATE,
			field: 'published_date',
		},
		} 
	);
	return Book
};
