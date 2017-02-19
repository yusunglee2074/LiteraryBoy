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

router.post('/:ISBN13', function(req, res) {
	// if 이미 추가된 책인가? (유저 id와 isbn13의 값으로 검증)
	    // 추가 된 책이면 추가 됬다고 안내
	// 추가 된 책이 아닐시 유저 id와 책 ISBN을 받아서 Readbook 오브젝트를 만든다.
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
		Model.User.findOne({
			// 유저의 토큰으로 유저를 찾을 시에
			/*
			"where": {
				"tokenvalue": req.header.user_token
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
			}).then(function(readbook) {
				res.send(readbook)
			});
		});
	});
});

router.delete('/:ISBN13', function(req, res) {
	Model.Readbook.findOne({
		// 실제 코드
		/*
		"where": {
			"UserId": req.header.user_token,
			"isbn13": req.params['ISBN13']
		}
		*/
		// 테스트용 임의 값
		"where": {
			"UserId": 1,
			"isbn13": "9788968480652"
		}
	}).then(function(readbook) {
		readbook.destroy()
	}).then(function() {
		res.send('삭제성공')
	}).catch(function() {
		res.send('삭제실패')
	});
});

router.get('/all', function(req, res) {
	Model.Readbook.findAll({
		// 실제 코드
		/*
		"where": {
			"UserId": req.header.user_token
		}
		*/
		// 테스트용 임의 코드
		"where": {
			"UserId": 1
		}
	}).then(function(allbook) {
			res.send(allbook)
	})
});

module.exports = router;
