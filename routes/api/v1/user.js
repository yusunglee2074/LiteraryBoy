var express = require('express');
var router = express.Router();
var Model = require('../../../models');
var sequelize = require('sequelize')

router.post('/', function(req, res) {
	Model.User.findOne({"where": {"nickname": req.body.nickname}}).then(function(user) {
		if (user) {
			res.status(500);
			res.send("해당 닉네임이 이미 존재합니다.")
		} else {
			Model.User.create({
				"nickname": req.body.nickname,
				"profileimage": req.body.imageUrl,
				"userid": req.body.user_id
			}).catch(function(err) {
				res.send(err)
			}).then(function(user) {
				res.send("SUCCESS");
			});
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
