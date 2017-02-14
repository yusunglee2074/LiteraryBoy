const sequelize = require('./index');
const User = require('./User');
const Comment = require('./Comment');

module.exports = function(sequelize, DataTypes) {
    const Remind = sequelize.define('remind', {
        reminddate: {
            type: Sequelize.DATE,
            field: 'remind_date',
            },
        },
    }, {
        classMethods: {
            associate: function(models) {
                Remind.belogsTo(Comment),
                Remind.belogsTo(User)
            };
        };
    }); 
    return HashTag;
};

