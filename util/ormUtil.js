var _ = require("underscore");

module.exports = {
    dateToTimestamp: function(obj) {
        console.log(obj.dataValues);
        console.log(_.isArray( [] ));
        console.log(_.isArray( {} ));
        if (_.isArray(obj.dataValues)) {
            if (obj.dataValues.length > 0) {
                for (var i = 0; i < obj.dataValues.length; i++) {
                    obj.dataValues[i].createdAt = Math.round(obj.dataValues[i].createdAt.getTime()/1000);
                    obj.dataValues[i].updatedAt = Math.round(obj.dataValues[i].updatedAt.getTime()/1000);
                }
            }
        } else {
            obj.dataValues.createdAt = Math.round(obj.dataValues.createdAt.getTime()/1000);
            obj.dataValues.updatedAt = Math.round(obj.dataValues.updatedAt.getTime()/1000);
        }
        console.log(obj.dataValues);
        return obj;
    }
};
