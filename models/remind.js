module.exports = function(sequelize, DataTypes) {
    const Remind = sequelize.define('Remind', {
        reminddate: {
            type: DataTypes.DATE,
            field: 'remind_date',
            },
		// 18일 회의때 나온 내용입니다. 리마인드를 사용자가 날짜를 지정하는 것이 아닌
		// 예를 들면 리마인트 하고 싶은 포스트가 있는데 '내가 기분 나쁠때 보여줘'를 위해
		// 저장할때 '기분나쁨' 기분의 카테고리에 리마인드 할 포스트를 집어 넣습니다.
		// 추후 앱을 실행시키면 사용자의 기분을 묻고 해당 기분에 해당하는 리마인드된
		// 포스트를 랜덤하게 보여줍니다.
        feeling: {
            type: DataTypes.STRING,
            field: 'feeling',
            },
        remindcount: {
            type: DataTypes.INTEGER,
            field: 'remind_count',
            },
	}, {
        classMethods: {
            associate: function(models) {
                Remind.belongsTo(models.Comment),
                Remind.belongsTo(models.User)
            }
        }
    }); 
    return Remind;
};

