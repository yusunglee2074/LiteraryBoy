const sequelize = require('./index');
const ReadBook = require('./Read_book');

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
		facebooktoken: {
			type: Sequelize.STRING,
			field: 'facebook_token',
		},
		navertoken: {
			type: Sequelize.STRING,
			field: 'naver_token',
		},
		kakaotoken: {
			type: Sequelize.STRING,
			field: 'kakao_token',
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
				User.hasMany(Readbook, {as: 'readbooks'})
			},
		}
	});
	return User;
};
