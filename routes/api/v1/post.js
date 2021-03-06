var express = require('express');
var async = require('async');
var router = express.Router();
var Model = require('../../../models');
var sequelize = require('sequelize')
var ormUtil = require('../../../util/ormUtil');

router.post('/:ISBN13', function(req, res) {
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
                    "isbn13": req.params['ISBN13'],
                    "UserId": user.id
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
                    Model.Post.create({
                        "content": req.body.content,
                        "likecount": Math.floor(Math.random() * 10),
                        "imagepath": req.body.imageUrl,
                        "theme": req.body.theme,
                        "page": req.body.page, 
                        // if 해쉬태그가 있다면...? 아직 해쉬태그 추가 구현 안함
                        // thorugh 테이블이 있다면 생성방법에 대해 검색해봐야함.
                        "ReadbookId": book.get('id')
                    }).then(function(post) {
                        Model.Post.findOne({
                            "where": {
                                "id": post.get('id')
                            },
                            "include": [
                                {
                                    "model": Model.Readbook,
                                    "include": [Model.User]
                                }
                            ]
                        }).then(function(post) {
                            // console.log(post);
                            res.send({
                                "message": {
                                    "result": {
                                        // "post": ormUtil.combineUser(post)
                                        "post": post
                                     }
                                 }
                            });
                        }).catch(function(error) {
                            res.status(500).send({
                                "message": {
                                    "result": {
                                        "error": error
                                     }
                                 }
                            });
                        });
                    }).catch(function(error) {
                        res.status(500).send({
                            "message": {
                                "result": {
                                    "error": error
                                 }
                             }
                        });
                    });
                }
            }).catch(function(error) {
                res.status(500).send({
                    "message": {
                        "result": {
                            "error": error
                         }
                     }
                });
            });
        }
    }).catch(function(error) {
        res.status(500).send({
            "message": {
                "result": {
                    "error": error
                 }
             }
        });
    });
});

router.delete('/:postId', function(req, res) {
    Model.Post.findOne({
        "where": {
            "id": req.params['postId']
        }
    }).then(function(post) {
        if (!post) {
            res.send({
                "message": {
                    "result": {
                        "post": {}
                     }
                 }
            });
        } else {
            // if post가 null이면  삭제 실패
            post.destroy()
            res.send({
                "message": "삭제 성공."
            })
        }
    }).catch(function() {
        res.status(500).send({
            "message": {
                "result": {
                    "error": error
                 }
             }
        });
    });
});

router.get('/:ISBN13/my', function(req, res) {
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
                    Model.Post.findAll({
                        "where": {
                            "ReadbookId": readbook.id
                        },
                        /*
                        "include": 
                        {
                            "model": Model.Readbook,
                            "where": { 'isbn13': req.params['ISBN13'] }
                        },
                        */
                    }).then(function(post) {
                        if (!post) {
                            res.send({
                                "message": {
                                    "result": {
                                        "post": {
                                            "posts": []
                                        }
                                     }
                                 }
                            });
                        } else {
                            res.json({
                                "message": {
                                    "result": {
                                        "post": {
                                            "posts": ormUtil.combineUser(post)
                                         }
                                     }
                                }
                            });
                        }
                    }).catch(function(error) {
                        res.status(500).send({
                            "message": {
                                "result": {
                                    "error": error
                                 }
                             }
                        });
                    });
                }
            }).catch(function(error) {
                res.status(500).send({
                    "message": {
                        "result": {
                            "error": error
                         }
                     }
                });
            });
        }
    }).catch(function(error) {
        res.status(500).send({
            "message": {
                "result": {
                    "error": error
                 }
             }
        });
    });
});

router.get('/:ISBN13/all', function(req, res) {
    Model.Readbook.findOne({
        "where": {
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
            Model.Post.findAll({
                "where": {
                    "ReadbookId": readbook.id
                }
            }).then(function(post) {
                if (!post) {
                    res.send({
                        "message": {
                            "result": {
                                "post": {
                                    "posts": []
                                }
                             }
                         }
                    });
                } else {
                    res.send({
                        "message": {
                            "result": {
                                "post": {
                                    "posts": ormUtil.combineUser(post)
                                 }
                             }
                        }
                    });
                }
            }).catch(function(error) {
                res.status(500).send({
                    "message": {
                        "result": {
                            "error": error
                         }
                     }
                });
            });
        }
    }).catch(function(error) {
        res.status(500).send({
            "message": {
                "result": {
                    "error": error
                 }
             }
        });
    });
});

router.put('/:postid', function(req, res) {
    Model.Post.findOne({
        "where": {
            "id": req.params["postid"]
        }
    }).then(function(post) {
        if (!post) {
            res.send({
                "message": {
                    "result": {
                        "post": {}
                     }
                 }
            });
        } else {
            // 해당아이디의 포스트가 없을 경우 에러 처리
            post.update({
                content: req.body.content,
                page: req.body.page,
                imagepath: req.body.imageUrl,
                theme: req.body.theme,
                type: req.body.type
            }).then(function(post) {
                Model.Post.findOne({
                    "where": {
                        "id": post.get('id')
                    },
                    "include": [Model.User]
                }).then(function(post) {
                    res.send({
                        "message": {
                            "result": {
                                "post": ormUtil.combineUser(post)
                             }
                         }
                    });
                }).catch(function(error) {
                    res.status(500).send({
                        "message": {
                            "result": {
                                "error": error
                             }
                         }
                    });
                });
            }).catch(function(error) {
                res.status(500).send({
                    "message": {
                        "result": {
                            "error": error
                         }
                     }
                });
            });
        }
    }).catch(function(error) {
        res.status(500).send({
            "message": {
                "result": {
                    "error": error
                 }
             }
        });
    });
});

module.exports = router;
