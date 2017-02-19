var express = require('express');
var async = require('async');
var daum = require('../../../util/daum');
var router = express.Router();
var Model = require('../../../models');
var sequelize = require('sequelize')


router.get('/search', function(req, res, next) {
    console.log(req.query);
    daum.search(req.query.q, function(error, response, body) {
        var bodyObject = JSON.parse(body);
        console.log(bodyObject.channel.item.length);

        // send
        res.send(bodyObject.channel.item);

        if (bodyObject.channel.item.length > 0) {
            // save
            async.each(bodyObject.channel.item, function(item, callback) {
                // if exist isbn?
                    // then update or ignore
                // else
                    // save


                /*
                Model.Book.create({
                    "title": item.title,
                    "isbn13": item.isbn13,
                    "raw": JSON.stringify(item)
                // }).then(function() {
                })
                */
                callback(null);
            }, function() {
                console.log('final')
            });
        }
    });
});

router.post('/book/add', function(req, res) {
	// if 이미 추가된 책인가?
	    // 추가 된 책이면 추가 됬다고 안내
	// 추가 된 책이 아닐시 유저 id와 책 ISBN을 받아서 Readbook 오브젝트를 만든다.
	Model.Book.findOne({
		// 실제코드
		/*
		"where": {
			"isbn13": req.query.isbn
		*/
		// 개발 임의 코드
		"where": {
			"id": "1"
		}
	}).then(function(book) {
		Model.User.findOne({
			// 유저의 토큰으로 유저를 찾을 시에
			/*
			"where": {
				"tokenvalue": req.query.tokenvalue
			*/
			// 개발 단계 임의 유저
			"where": {
				"id": "1"
			}
		}).then(function(user) {
			Model.Readbook.create({
				"readstartdate": sequelize.fn('now'),
				"readenddate": null,
				"reading_page": 0,
				"isbn13": book.get("isbn13"),
				"BookId": book.get("id"),
				"UserId": user.get("id"),
			})
		});
	});
});

module.exports = router;
