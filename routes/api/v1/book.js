var express = require('express');
var async = require('async');
var daum = require('../../../util/daum');
var aladin = require('../../../util/add_page_with_aladin');
var router = express.Router();
var Model = require('../../../models');
var ormUtil = require('../../../util/ormUtil');
var sequelize = require('sequelize')
var _ = require('underscore')


router.get('/search', function(req, res) {
    var booklist = {
        '생각하지 않는 사람들': 9788935208647,
        '미래산업보고서': 9788964358702,
        '넛지': 9788901093154, 
        '그랜드 부다페스트 호텔': 9791155810767, 
        '어린왕자': 9791186634684, 
        '자존감 수업': 9791186757093, 
        '테후테후장에 어서 오세요': 9791195491469, 
        '새는 날아가면서 뒤돌아보지 않는다': 9791186900222, 
        '어쩌면 별들이 너의 슬픔을 가져갈지도 몰라': 9788959139309, 
        '왜 나는 너를 사랑하는가': 9788986836240, 
        '축복': 9788954644501, 
        '미래의 속도': 9788935211302
    };

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
                        "page"         : Math.round(Math.random()*180) + 180,
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
                    var hotItem = [];
                    async.each(_.keys(booklist), function(key, callback) {
                        if (key.toString().indexOf(req.query.keyword) > -1) {
                            Model.Book.findOne({"where": {"isbn13": booklist[key].toString() } }).then(function(book) {
                                if (respArr.length > 0) {
                                    hotItem.push({
                                        "bookId"       : book.isbn13,
                                        "name"         : book.title,
                                        "author"       : JSON.parse(book.get('raw')).author,
                                        "page"         : Math.round(Math.random()*100 + Math.random()*300),
                                        "pub_nm"       : JSON.parse(book.get('raw')).pub_nm,
                                        "pub_date"       : JSON.parse(book.get('raw')).pub_date,
                                        "thumbnailUrl"       : JSON.parse(book.get('raw')).cover_l_url

                                    });
                                    callback(null);
                                } else {
                                    callback(null);
                                }
                            });
                        } else {
                            callback(null);
                        }
                    }, function() {
                        res.send({
                            "message": {
                                "result": {
                                    "bookList": {
                                        "books": hotItem.concat(_.without(respArr, hotItem))
                                    }
                                }
                            }
                        });
                    });

                });
            } else {
                res.send([]);
            }
        } else {
            res.send([]);
        }
    });
});

router.post('/:ISBN13', function(req, res) {
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
            Model.Readbook.findOne({
                "where": {
                    "UserId": user.id,
                    "BookId": book.id
				},
                "include": [Model.User]
                
			}).then(function(readbook) {
                if (readbook) {
                    res.send({
                        "message": {
                            "result": {
                                "book": ormUtil.combineUser(ormUtil.dateToTimestamp(readbook))
                             }
                         }
                    });
                } else {
                    aladin.page_search(req.params['ISBN13'], function(error, response, body, jbody) {
                        // var jbody = JSON.parse(body.replace(/;$/,''));
                        var page = Math.round(Math.random()*180) + 180;
                        if (jbody.item) {
                            var page = jbody.item[0].bookinfo.itemPage;
                        }
                        
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
                                    "BookId": book.get('id'),
                                    "UserId": user.get('id'),
                                    "totalpage": page
                                    }).then(function(readbook) {
                                        Model.Readbook.findOne({
                                            "where": {
                                                "id": readbook.id
                                            },
                                            "include": [Model.User]
                                        }).then(function(readbook) {
                                            res.send({
                                            "message": {
                                                "result": {
                                                    "book": ormUtil.combineUser(ormUtil.dateToTimestamp(readbook))
                                                 }
                                             }
                                            });
                                        }).catch(function(error) {
                                            res.status(501).send({
                                                "message": {
                                                    "result": {
                                                        "error": error
                                                     }
                                                 }
                                            });
                                        });
                                    });
                            }
                        }).catch(function(err) {
                            res.status(502).send({
                                "message": {
                                    "result": {
                                        "error": err
                                     }
                                 }
                            });
                        });



                    });
                }
			}).catch(function(err) {
                res.status(503).send({
                    "message": {
                        "result": {
                            "error": err
                         }
                     }
                });
			});
        }).catch(function(err) {
            res.status(504).send({
                "message": {
                    "result": {
                        "error": err
                     }
                 }
            });
		});
    }).catch(function(err) {
        res.status(505).send({
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
                },
                "include": [Model.User]
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
                                    "books": ormUtil.combineUser(ormUtil.dateToTimestamp(allbook))
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
                },
                include: [Model.User]
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
                                "book": ormUtil.combineUser(ormUtil.dateToTimestamp(book))
                             }
                         }
                    });
                }
            })
        }
    });
});


module.exports = router;
