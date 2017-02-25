var express = require('express');
var async = require('async');
var daum = require('../../../util/daum');
var aladin = require('../../../util/add_page_with_aladin');
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
                    }).catch(function (book) {
                        callback(null);
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
        if (book) {
            aladin.page_search(req.params['ISBN13'], function(error, response, body) {
                var jbody = JSON.parse(body.replace(/;$/,''));
                var page = jbody.item[0].bookinfo.itemPage;
                
                Model.User.findOne({
                    "where": {
                        "userid": req.get('user_id')
                    }
                }).then(function(user) {
                    if (!user) {
                        res.send({
                            "message": {
                                "result": {
                                    "user": {}
                                 }
                             }
                        });
                    } else {
                        Model.Readbook.create({
                            "readstartdate": sequelize.fn('now'),
                            "readenddate": null,
                            "reading_page": 0,
                            "isbn13": book.get('isbn13'),
                            "BookId": '12321215r23lkjhr23lk',
                            "UserId": user.get('id'),
                            "totalpage": page
                        }).then(function(readbook) {
                            res.send({
                                "message": {
                                    "result": {
                                        "book": readbook 
                                     }
                                 }
                            });
                        }).catch(function(err) {
                            res.status(500).send({
                                "message": {
                                    "result": {
                                        "error": err
                                     }
                                 }
                            });
                        });
                    }
                }).catch(function(err) {
                    res.status(500).send({
                        "message": {
                            "result": {
                                "error": err
                             }
                         }
                    });
                });
            });
        } else {
            res.send({
                "message": {
                    "result": {
                        "book": {}
                     }
                 }
            });
        }
    }).catch(function(error) {
        res.status(500).send({
            "message": {
                "result": {
                    "error": err
                 }
             }
        });
    });
});

router.delete('/:ISBN13', function(req, res) {
	Model.User.findOne({
		"where": {
			"userid": req.get('user_id')
		}
	}).then(function(user) {
        if (!user) {
            res.send({
                "message": {
                    "result": {
                        "user": {}
                     }
                 }
            });
        } else {
            Model.Readbook.findOne({
                "where": {
                    "UserId": user.id,
                    "isbn13": req.params['ISBN13']
                }
            }).then(function(readbook) {
                if (!readbook) {
                    res.send({
                        "message": {
                            "result": {
                                "readbook": {}
                             }
                         }
                    });
                } else {
                    readbook.destroy()
                    res.send({
                        "message": "삭제 성공."
                    })
                }
            }).catch(function(err) {
                res.status(500).send({
                    "message": {
                        "result": {
                            "error": err
                         }
                     }
                });
            });
        }
    });
});

router.get('/all', function(req, res) {
	Model.User.findOne({
		"where": {
			"userid": req.get('user_id')
		}
	}).then(function(user) {
        if (!user) {
            res.send({
                "message": {
                    "result": {
                        "user": {}
                     }
                 }
            });
        } else {
            Model.Readbook.findAll({
                "where": {
                    "UserId": user.id
                }
            }).then(function(allbook) {
                if (!allbook) {
                    res.send({
                        "message": {
                            "result": {
                                "readbooks": []
                             }
                         }
                    });
                } else {
                    res.send({
                        "message": {
                            "result": {
                                "bookList": {
                                    "books": allbook 
                                 }
                             }
                        }
                    });
                }
            });
        }
    })
});

router.get('/:ISBN13', function(req, res) {
	Model.User.findOne({
		"where": {
			"userid": req.get('user_id')
		}
	}).then(function(user) {
        if (!user) {
            res.send({
                "message": {
                    "result": {
                        "user": {}
                     }
                }
            });
        } else {
            Model.Readbook.findOne({
                "where": {
                    "UserId": user.id,
                    "isbn13": req.params['ISBN13']
                }
            }).then(function(book) {
                if (!book) {
                    res.send({
                        "message": {
                            "result": {
                                "book": {}
                             }
                        }
                    });
                } else {
                    res.send({
                        "message": {
                            "result": {
                                "book": book,
                             }
                         }
                    });
                }
            })
        }
    });
});


module.exports = router;
