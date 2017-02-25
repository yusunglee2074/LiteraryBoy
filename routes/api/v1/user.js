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
                    res.send("FAIL\t" + err);
                    console.log(err);
                });
            } else {
                res.status(500).send("FAIL");
                console.log("req.bodyuser_id is null");
            }
		}
	});
});

router.get('/', function(req, res) {
	Model.User.findOne({
		"where": {
			"userid": req.get('user_id')
		}
	}).then(function(user) {
		res.json({
			"message": {
				"result": {
					"user": user 
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
		console.log(user);
		user.destroy()
		res.send({
			"message": "삭제 성공"
		})
	}).catch(function(err) {
		res.status(err.status || 500);
		res.send({
			"message": err
		})
	});
});

router.put('/', function(req, res) {
	Model.User.findOne({
		"where": {
			"userid": req.get('user_id')
		}
	}).then(function(user) {
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
		});
	});
});
				
module.exports = router;
