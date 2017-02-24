var express = require('express');
var async = require('async');
var daum = require('../../../util/daum');
var router = express.Router();
var Model = require('../../../models');
var sequelize = require('sequelize')


router.get('/search', function(req, res) {
    daum.search(req.query.keyword, function(error, response, body) {
        var bodyObject = JSON.parse(body);

        if (bodyObject.channel) {
            if (bodyObject.channel.item.length > 0) {
                var respArr = [];

                async.each(bodyObject.channel.item, function(item, callback) {
                    respArr.push({
                        "bookId"       : item.isbn13,
                        "name"         : item.title,
                        "author"       : item.author,
                        "pub_nm"       : item.pub_nm,
                        "pub_date"     : Math.round(new Date(item.pub_date.substr(0,4), item.pub_date.substr(4,2) - 1, item.pub_date.substr(6,2)).getTime()/1000),
                        "thumbnailUrl" : item.cover_l_url
                    });

                    Model.Book.findOne({
                        "where": {
                            "isbn13" : item.isbn13
                        }
                    }).then(function (book) {
                        if (!book) {
                            Model.Book.create({
                                "title": item.title,
                                "isbn13": item.isbn13,
                                "raw": JSON.stringify(item)
                            }).then(function() {
                                callback(null);
                            })
                        } else {
                            callback(null);
                        }
                    });
                }, function() {
                    res.send({
                        "message": {
                            "result": {
                                "bookList": {
                                    "books": respArr
                                }
                            }
                        }
                    });
                });
            } else {
                // console.log(bodyObject);
                res.send([]);
            }
        } else {
            // console.log(bodyObject);
            res.send([]);
        }
    });
});

router.post('/:ISBN13', function(req, res) {
    // if 이미 추가된 책인가? (유저 id와 isbn13의 값으로 검증)
        // 추가 된 책이면 추가 됬다고 안내
    // 추가 된 책이 아닐시 유저 id와 책 ISBN을 받아서 Readbook 오브젝트를 만든다.
    Model.Book.findOne({
        "where": {
            "isbn13": req.params['ISBN13']
        }
    }).then(function(book) {
        Model.User.findOne({
            "where": {
                "userid": req.get('user_id')
            }
		}).then(function(user) {
			Model.Readbook.create({
				"readstartdate": sequelize.fn('now'),
				"readenddate": null,
				"reading_page": 0,
				"isbn13": book.get('isbn13'),
				"BookId": book.get('id'),
				"UserId": user.get('id')
			}).then(function(readbook) {
				res.send({
					"message": {
						"result": {
							"book": readbook 
						 }
					 }
				});
			});
		});
    });
});

router.delete('/:ISBN13', function(req, res) {
    Model.Readbook.findOne({
        "where": {
            "UserId": req.get('user_id'),
            "isbn13": req.params['ISBN13']
        }
    }).then(function(readbook) {
        readbook.destroy()
        res.send({
            "message": "삭제 성공."
        })
    }).catch(function(err) {
        // 오류 처리를 하는법 공부해서 리팩토링해야된다.
        // TODO: status code 500 으로 반환해주세요
        res.send({
            "message":  "삭제실패.",
            "err": "해당 값의 책이 없습니다." 
        });
    });
});

router.get('/all', function(req, res) {
    Model.Readbook.findAll({
        "where": {
            "UserId": req.get('user_id')
        }
    }).then(function(allbook) {
        res.send({
            "message": {
                "result": {
                    "bookList": {
                        "books": allbook 
                         }
                     }
                }
        });
    })
});

router.get('/:ISBN13', function(req, res) {
    Model.Readbook.findOne({
        "where": {
            "UserId": req.get('user_id'),
            "isbn13": req.params['ISBN13']
        }
    }).then(function(book) {
        res.send({
            "message": {
                "result": {
                    "book": book,
                 }
             }
        })
    });
});


module.exports = router;
