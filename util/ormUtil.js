var _ = require("underscore");

module.exports = {
    dateToTimestamp: function(obj) {
        if (_.isArray(obj)) {
            if (obj.length > 0) {
                for (var i = 0; i < obj.length; i++) {
                    obj[i].dataValues.createdAt = Math.round(obj[i].dataValues.createdAt.getTime()/1000);
                    obj[i].dataValues.updatedAt = Math.round(obj[i].dataValues.updatedAt.getTime()/1000);
                    if (obj[i].dataValues.readstartdate) {
                        obj[i].dataValues.readstartdate = Math.round(obj[i].dataValues.readstartdate.getTime()/1000);
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
        if (_.isArray(obj)) {
            if (obj.length > 0) {
                for (var i = 0; i < obj.length; i++) {
                    obj[i].dataValues.nickname = obj[i].dataValues.User.nickname;
                    obj[i].dataValues.user_id = obj[i].dataValues.User.userid; 
                    obj[i].dataValues.profileimage = obj[i].dataValues.User.profileimage; 
                    delete obj[i].dataValues.User;
                    delete obj[i].dataValues.UserId;
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
