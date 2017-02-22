var express = require('express');
var async = require('async');
var daum = require('../../../util/daum');
var router = express.Router();
var Model = require('../../../models');
var sequelize = require('sequelize')


router.post('/:ISBN13/text', function(req, res) {
	Model.Book.findOne({
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
				// if 해시태그가 이미 들어 있다면
				"hashtaghh": user.get("tokenvalue"),
			}).then(function(readbook) {
				res.send(readbook)
		});
	});
});

