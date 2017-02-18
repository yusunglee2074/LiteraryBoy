module.exports = function(sequelize, DataTypes) {
    const Remind = sequelize.define('Remind', {
        reminddate: {
            type: DataTypes.DATE,
            field: 'remind_date',
            }
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

