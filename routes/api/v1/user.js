var express = require('express');
var router = express.Router();
var Model = require('../../../models');
var sequelize = require('sequelize')

router.post('/', function(req, res) {
	Model.User.findOne({"where": {"userid": req.body.userId}}).then(function(user) {
		if (user) {
			// status set
            res.send("SUCCESS");
		} else {
            if (req.body.userId) {
                Model.User.create({
                    "nickname": req.body.nickname,
                    "profile_image_path": req.body.imageUrl,
                    "userid": req.body.userId
                }).then(function(user) {
                    res.send("SUCCESS");
                });
            } else {
				res.status(500);
                res.send("FAIL");
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
