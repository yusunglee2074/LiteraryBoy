var express = require('express');
var router = express.Router();
var Model = require('../../../models');
var sequelize = require('sequelize')

router.post('/', function(req, res) {
	Model.User.findOne({"where": {"userid": req.body.user_id}}).then(function(user) {
		if (user) {
			// status set
            res.send("SUCCESS");
		} else {
            if (req.body.user_id) {
                Model.User.create({
                    "nickname": req.body.nickname,
                    "profile_image_path": req.body.imageUrl,
                    "userid": req.body.user_id
                }).then(function(user) {
                    res.send("SUCCESS");
                }).catch(function(err) {
                    res.status(500).send("FAIL\t" + err);
                    console.log(err);
                });
            } else {
                res.status(500).send("FAIL");
            }
		}
	}).catch(function(error) {
        res.status(500).send({
            "message": {
                "result": {
                    "error": error
                 }
             }
        });
	});
});

router.get('/', function(req, res) {
	Model.User.findOne({
		"where": {
			"userid": req.get('user_id')
		}
	}).then(function(user) {
        if (!user) {
            res.send({
                "message": {
                    "result": {
                        "user": {}
                     }
                 }
            });
        } else {
            res.json({
                "message": {
                    "result": {
                        "user": user 
                    }
                }
            });
        }
	}).catch(function(error) {
        res.status(500).send({
            "message": {
                "result": {
                    "error": error
                 }
             }
        });
    });
});

router.delete('/', function(req, res) {
	Model.User.findOne({
		"where": {
			"userid": req.get('user_id')
		}
	}).then(function(user) {
        if (!user) {
            res.send({
                "message": {
                    "result": {
                        "user": {}
                     }
                 }
            });
        } else {
            user.destroy()
            res.send({
                "message": "삭제 성공"
            });
        }
	}).catch(function(error) {
        res.status(500).send({
            "message": {
                "result": {
                    "error": error
                 }
             }
        });
	});
});

router.put('/', function(req, res) {
	Model.User.findOne({
		"where": {
			"userid": req.get('user_id')
		}
	}).then(function(user) {
        if (!user) {
            res.send({
                "message": {
                    "result": {
                        "user": {}
                     }
                 }
            });
        } else {
            user.update({
                "nickname": req.body.nickname,
                "profileimage": req.body.imageUrl
            }).then(function(user) {
                res.send({
                    "message": {
                        "result": {
                            "user": user
                        }
                    }
                });
        }).catch(function(error) {
                res.status(500).send({
                    "message": {
                        "result": {
                            "error": error
                         }
                     }
                });
            });
        }
	}).catch(function(error) {
        res.status(500).send({
            "message": {
                "result": {
                    "error": error
                 }
            }
        });
    });
});
				
module.exports = router;
