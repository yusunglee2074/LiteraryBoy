var express = require('express');
var async = require('async');
var daum = require('../../../util/daum');
var router = express.Router();
var Model = require('../../../models');
var sequelize = require('sequelize')


router.post('/:ISBN13/text', function(req, res) {
    var hastag = [];
	hashtag.push(req.body.hashtag);
	// 해쉬태그를 # 마다 쪼개서 딕셔너리로 만든다.
	var hashdict = {};
	Model.Readbook.findOne({
		// 실제코드
		/*
		"where": {
			"isbn13": req.params['ISBN13']
		*/
		// 개발 임의 코드
		"where": {
			"id": "1"
			"UserId": req.head.token_value
		}
		}).then(function(book) {
			Model.Post.create({
				"content": req.body.content,
				"likecount": 0,
				"imagepath": null,
				"theme": req.body.theme,
				"page": req.body.page, 
				//if 해쉬태그가 있다면...?
				// thorugh 테이블이 있다면 생성방법에 대해 검색해봐야함.
				"UserId": book.UserId,
				"BookId": book.isbn13,

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

router.delete('/:postid', function(req, res) {
	Model.Post.findOne({
		"where": {
			"UserId": req.head.token_value,
			"id": req.params['postid']
		}
	}).then(function(post) {
		post.destroy()
	}).then(function() {
		// Readbook 삭제와 똑같이 오류 처리 해야함
		res.send({
			"message": "삭제성공했습니다."
		});
	});
});

router.get('/all', function(req, res) {
	// 자신의 모든 포스트 출력
	// if 책 id도 같이 온다면 해당 책 id의 자신의 포스트만 출력 
	// if 유저 토큰이 빈값, 책 id만 온다면 해당 책 포스트만 모두 출력
	Model.Post.findAll({
		"where": {
			"UserId": req.head.token_value
		}
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
		}).then(function() {
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
})
		
