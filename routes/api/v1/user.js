var express = require('express');
var router = express.Router();
var Model = require('../../../models');
var sequelize = require('sequelize')

router.post('/', function(req, res) {
	Model.User.findOne({"where": {"nickname": req.body.nickname}}).then(function(user) {
		if (user) {
			// status set
			res.send("해당 닉네임이 있습니다.")
		} else {
			Model.User.create({
				"nickname": req.body.nickname,
				"profile_image_path": req.body.imageUrl,
				"userid": req.body.userid
			}).catch(function(err) {
				res.send(err)
			}).then(function(user) {
				res.send({ "message": { "result": { "user": user } } });
			});
		}
	});
});

router.get('/:userid', function(req, res) {
	Model.User.findOne({
		"where": {
			"userid": req.params['userid']
		}
	}).then(function(user) {
		res.json({
			"message": {
				"result": {
					"user": {
						"user": user
					}
				}
			}
		});
	});
});

router.delete('/:userid', function(req, res) {
	Model.User.findOne({
		"where": {
			"userid": req.params['userid']
		}
	}).then(function(user) {
		user.destroy()
		res.json({
			"message": "삭제 성공"
		})
	}).catch(function(err) {
		res.status(err.status || 500);
		res.json({
			"message": err
		})
	});
});

router.put('/:userid', function(req, res) {
	Model.User.findOne({
		"where": {
			"userid": req.params['userid']
		}
	}).then(function(user) {
		user.update({
			"nickname": req.body.nickname,
			"profile_image_path": null,
			"userid": req.body.userid
	}).then(function(user) {
		res.send({
			"message": {
				"result": {
					"user": {
						"user": user
						}
					}
				}
			});
		});
	});
});
				
module.exports = router;
