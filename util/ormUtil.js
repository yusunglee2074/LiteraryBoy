var _ = require("underscore");

module.exports = {
    dateToTimestamp: function(obj) {
        if (_.isArray(obj.dataValues)) {
            if (obj.dataValues.length > 0) {
                for (var i = 0; i < obj.dataValues.length; i++) {
                    obj.dataValues[i].createdAt = Math.round(obj.dataValues[i].createdAt.getTime()/1000);
                    obj.dataValues[i].updatedAt = Math.round(obj.dataValues[i].updatedAt.getTime()/1000);
                    if (obj.dataValues[i].readstartdate) {
                        obj.dataValues[i].readstartdate = Math.round(obj.dataValues[i].readstartdate.getTime()/1000);
                    }
                }
            }
        } else {
            obj.dataValues.createdAt = Math.round(obj.dataValues.createdAt.getTime()/1000);
            obj.dataValues.updatedAt = Math.round(obj.dataValues.updatedAt.getTime()/1000);
            if (obj.dataValues.readstartdate) {
                obj.dataValues.readstartdate = Math.round(obj.dataValues.readstartdate.getTime()/1000);
            }
        }
        return obj;
    },
    combineUser: function(obj) {
        if (_.isArray(obj.dataValues)) {
            if (obj.dataValues.length > 0) {
                for (var i = 0; i < obj.dataValues.length; i++) {
                    obj.dataValues[i].nickname = obj.dataValues[i].User.nickname;
                    obj.dataValues[i].user_id = obj.dataValues[i].User.userid; 
                    obj.dataValues[i].profileimage = obj.dataValues[i].User.profileimage; 
                    delete obj.dataValues[i].User;
                    delete obj.dataValues[i].UserId;
                }
            }
        } else {
            obj.dataValues.nickname = obj.dataValues.User.nickname;
            obj.dataValues.user_id = obj.dataValues.User.userid; 
            obj.dataValues.profileimage = obj.dataValues.User.profileimage; 
            delete obj.dataValues.User;
            delete obj.dataValues.UserId;
        }
        return obj;
    }
};
