var express = require('express');
var async = require('async');
var daum = require('../../../util/daum');
var router = express.Router();
var Model = require('../../../models');
var sequelize = require('sequelize')


router.post('/:ISBN13/text', function(req, res) {
	Model.Readbook.findOne({
		// 실제코드
		/*
		"where": {
			"isbn13": req.params['ISBN13']
		*/
		// 개발 임의 코드
		"where": {
			"id": "1"
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
				"hashtag": req.body.hashtag,
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

