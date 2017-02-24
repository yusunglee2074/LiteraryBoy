var express = require('express');
var async = require('async');
var router = express.Router();
var Model = require('../../../models');
var sequelize = require('sequelize')

router.post('/:ISBN13/text', function(req, res) {
    var hastag = [];
	// 해쉬태그를 # 마다 쪼개서 딕셔너리로 만든다.
	var hashdict = {};
	Model.Readbook.findOne({
		"where": {
			"isbn13": req.params['ISBN13'],
			"UserId": '1' 
		}
	}).then(function(book) {
		console.log(book);
		console.log("hello");
		Model.Post.create({
			"content": req.body.content,
			"likecount": 0,
			"imagepath": null,
			"theme": req.body.theme,
			"page": req.body.page, 
			// if 해쉬태그가 있다면...? 아직 해쉬태그 추가 구현 안함
			// thorugh 테이블이 있다면 생성방법에 대해 검색해봐야함.
			"UserId": book.get('UserId'),
			"ReadbookId": book.get('id')
		}).then(function(post) {
			res.send({
				"message": {
					"result": {
						"Post": post
					 }
				 }
			});
		});
	});
});

router.post('/:ISBN13/image', function(req, res) {
    var hastag = [];
	// 해쉬태그를 # 마다 쪼개서 딕셔너리로 만든다.
	var hashdict = {};
	Model.Readbook.findOne({
		"where": {
			"isbn13": req.params['ISBN13'],
			"UserId": '1' 
		}
	}).then(function(book) {
		console.log(book);
		console.log("hello");
		Model.Post.create({
			"content": req.body.content,
			"likecount": 0,
			"imagepath": null,
			"theme": req.body.theme,
			"page": req.body.page, 
			// if 해쉬태그가 있다면...? 아직 해쉬태그 추가 구현 안함
			// thorugh 테이블이 있다면 생성방법에 대해 검색해봐야함.
			"UserId": book.get('UserId'),
			"ReadbookId": book.get('id')
		}).then(function(post) {
			res.send({
				"message": {
					"result": {
						"Post": post
					 }
				 }
			});
		});
	});
});

router.delete('/:postId/remove', function(req, res) {
	Model.Post.findOne({
		"where": {
			"id": req.params['postId']
		}
	}).then(function(post) {
		// if post가 null이면  삭제 실패
		console.log("@@@@@@@@@@@@" + post);
		post.destroy()
		res.send({
			"message": "삭제 성공."
		})
	}).catch(function() {
		// Readbook 삭제와 똑같이 오류 처리 해야함
		res.send({
			"message": "삭제실패."
		});
	});
});

router.get('/:ISBN13/my', function(req, res) {
	Model.User.findOne({
		"where": {
			//"tokenvalue": req.header.token_value
			"id": "1"
		}
	}).then(function(user) {
		Model.Post.findAll({
			"where": {
				"UserId": user.get('id') 
			},
			"include": 
			{
				"model": Model.Readbook,
				"where": { 'isbn13': req.params['ISBN13'] }
			},
	}).then(function(post) {
		res.json({
			"message": {
				"result": {
					"post": {
						"posts": post 
						 }
					 }
				}
			});
		});
	});
});

router.get('/:ISBN13/all', function(req, res) {
    Model.Post.findAll({
			"where": {
				"isbn13": req.params['ISBN13'] 
			}
	}).then(function(post) {
		res.json({
			"message": {
				"result": {
					"post": {
						"posts": post 
						 }
					 }
				}
			});
		});
	});
});

router.put('/:postid', function(req, res) {
	Model.Post.findOne({
		"where": {
			"UserId": req.head.token_value,
			"id": req.params["postid"]
		}
	}).then(function(post) {
		post.update({
			content: req.body.content,
			page: req.body.page,
			// 이미지 처리 방법을 아직 모른다.
			imagepath: req.body.image,
			theme: req.body.theme
	}).then(function(post) {
		res.send({
			"message": {
				"result": {
					"post": {
						"posts": post 
						 }
					}
				}
			});
		});
	});
});

module.exports = router;
