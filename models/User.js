const sequelize = require('./index');
const ReadBook = require('./Read_book');
const Comment = require('./Comment');

module.exports = function(sequelize, DataTypes) {
	const User = sequelize.define('user', {
		// primary key가 없으면 자동으로 id 칼럼을 생성하고 primary key로 삼는다.
		// createdAt, updatedAt 자동으로 생성된다.
		nickname: {
			type: Sequelize.STRING,
			allowNull: False,
			field: 'nickname',
			unique: true,
			validate: {
				len: [1,20],
				// 특수문자 허용안되게 기능추가해야함 
				},
		},
        // FIXME: 사용자가 어떤 토큰으로 인증했는지 정보가 있으면 api 응답할때 더 쉬울 듯 합니다.
		// FIXED: 어떤 토큰으로 인증했는지 항목 추가하겠습니다.
		tokentype: {
			type: Sequelize.STRING,
			field: 'token_type'
		},
		tokenvalue: {
			type: Sequelize.STRING,
			field: 'token_value',
		},
		profileimage: {
			type: Sequelize.STRING,
			field: 'profile_image_path',
		},
	},	{
		classMethods: {
			associate: function(models) {
				// 유저에 readbooksid 속성이 생긴다.
				// 유저는 getreadbooks 혹은 setreadbooks 로 읽있는 책 모델 하나를 가져올 수 있다.
				// User.hasMany(Readbook, {as: 'readbooks'})
				// User.hasMany(Comment, {as: 'comments'})
			},
		}
	});
	return User;
};
