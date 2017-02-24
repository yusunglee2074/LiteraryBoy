module.exports = function(sequelize, DataTypes) {
	const User = sequelize.define('User', {
		// primary key가 없으면 자동으로 id 칼럼을 생성하고 primary key로 삼는다.
		// createdAt, updatedAt 자동으로 생성된다.
		nickname: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'nickname',
			unique: false,
			validate: {
				len: [1,20],
				// 특수문자 허용안되게 기능추가해야함 
				},
		},
        // FIXME: 사용자가 어떤 토큰으로 인증했는지 정보가 있으면 api 응답할때 더 쉬울 듯 합니다.
		// FIXED: 어떤 토큰으로 인증했는지 항목 추가하겠습니다.
		userid: {
			type: DataTypes.STRING,
			field: 'user_id',
			unique: true
		},
		profileimage: {
			type: DataTypes.STRING,
			field: 'profile_image_path',
		},
	});
	return User;
};
