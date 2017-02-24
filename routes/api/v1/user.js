var express = require('express');
var async = require('async');
var router = express.Router();
var Model = require('../../../models');
var sequelize = require('sequelize')

router.post('/', function(req, res) {
	Model.User.create({
		"token_type": req.body.token_type,
		"nickname": req.body.nickname,
		// 프로필 파일 어디에 올리고 그 주소를 어떻게 가져올 것인가?
		"profile_image_path": null,
		"token_value": req.body.token_value
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

router.get('/:userId', function(req, res) {
	Model.User.findOne({
		"where": {
			"id": req.params['userId']
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

router.delete('/:userId', function(req, res) {
	Model.User.findOne({
		"where": {
			"id": req.params['id']
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

router.put('/:userId', function(req, res) {
	Model.User.findOne({
		"where": {
			"id": req.params['userId']
		}
	}).then(function(user) {
		user.update({
			"token_type": req.body.token_type,
			"nickname": req.body.nickname,
			"profile_image_path": null,
			"token_value": req.body.token_value
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
				

