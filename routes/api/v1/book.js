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
            "where": {
                "tokenvalue": req.header.user_token
            }
            // 개발 단계 임의 유저
            /*
            "where": {
                "id": "1"
            }
            */
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
                        "bookList": {
                            "addbook": readbook 
                             }
                         }
                     }
                });
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
            "isbn13": "9791133426898"
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
        // 실제 코드
        "where": {
            "UserId": req.header.user_token
        }
        // 테스트용 임의 코드
        /*
        "where": {
            "UserId": 1
        }
        */
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
        // 실제 코드
        "where": {
            "UserId": req.header.user_token,
            "isbn13": req.params['ISBN13']
        }
        // 테스트용 임의 코드
        /*
        "where": {
            "UserId": 1,
            "isbn13": "9788968480652"
        }
        */
    }).then(function(book) {
        res.send({
            "message": {
                "result": {
                    "bookList": {
                        "books": book 
                     }
                 }
             }
        })
    });
});


module.exports = router;
