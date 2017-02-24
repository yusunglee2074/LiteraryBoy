var express = require('express');
var router = express.Router();
var Model = require('../../../models');
var sequelize = require('sequelize')


router.post('/:postId', function(req, res) {
	Model.Post.findOne({
		"where": {
			"id": req.params['POSTID']
		}
	}).then(function(post) {
		Model.Comment.create({
			"content": req.body.content,
			"UserId": req.head.token_value,
			"PostId": post.id
			});
	}).then(function(comment) {
		res.send({
			"message": {
				"result": {
					"comment": comment 
				 }
			}
		});
	});
});


router.delete('/:postId/:commentId', function(req, res) {
	Model.Comment.findOne({
		"where": {
			"id": req.params['commentId']
		};
	}).then(function(comment) {
		// 오류처리 해야함
		comment.destroy()
	}).then(function() {
		res.send({
			"message": "삭제성공했습니다."
		});
	});
});

router.get('/:postId/list', function(req, res) {
	Model.Comment.findOne({
		"where": {
			"PostId": req.params['postId']
		}
	}).then(function(comment) {
		res.send({
			"message": {
				"result": {
					"comment": {
						"comments": comment 
					 }
				 }
			}
		});
	});
});

router.get('/my', function(req, res) {
	Model.User.findOne({
		"where": {
			"tokenvalue": req.header.token_value
		}
	}).then(function(user) {
		Model.Comment.findAll({
			"where": {
				"UserId": user.get('id')
			}
	}).then(function(comment) {
		res.send({
			"message": {
				"result": {
					"comment": {
						"comments": comment 
					 }
				 }
			}
		});
	});
});

router.put('/:commentId', function(req, res) {
	Model.Comment.findOne({
		"where": {
			"id": req.params['commentId']
		}
	}).then(function(comment) {
		comment.update({
			content: req.body.content
			});
	}).then(function(comment) {
		res.send({
			"message": {
				"result": {
					"comment": {
						"comments": comment 
					 }
				}
			}
		});
	});
});

module.exports = router;
