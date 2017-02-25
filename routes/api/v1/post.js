var express = require('express');
var async = require('async');
var router = express.Router();
var Model = require('../../../models');
var sequelize = require('sequelize')

router.post('/:ISBN13', function(req, res) {
    Model.User.findOne({
        "where": {
            "userid": req.get('user_id')
        }
    }).then(function(user) {
        Model.Readbook.findOne({
            "where": {
                "isbn13": req.params['ISBN13'],
                "UserId": user.id
            }
        }).then(function(book) {
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
                res.send({
                    "message": {
                        "result": {
                            "Post": post
                         }
                     }
                });
            }).catch(function(error) {
                res.send({
                    "message": {
                        "result": {
                            "error": error
                         }
                     }
                });
            });
        }).catch(function(error) {
            res.send({
                "message": {
                    "result": {
                        "error": error
                     }
                 }
            });
        });
    }).catch(function(error) {
        res.send({
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
        // if post가 null이면  삭제 실패
        post.destroy()
        res.send({
            "message": "삭제 성공."
        })
    }).catch(function() {
        // Readbook 삭제와 똑같이 오류 처리 해야함
        res.send({
            "message": "삭제실패."
        });
    });
});

router.get('/:ISBN13/my', function(req, res) {
    Model.User.findOne({
        "where": {
            "userid": req.get('user_id')
        }
    }).then(function(user) {
        Model.Readbook.findOne({
            "where": {
                "UserId": user.id,
                "isbn13": req.params['ISBN13']
            }
        }).then(function(readbook) {
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
        res.json({
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
    });
});

router.get('/:ISBN13/all', function(req, res) {
    Model.Readbook.findOne({
        "where": {
            "isbn13": req.params['ISBN13']
        }
    }).then(function(readbook) {
        Model.Post.findAll({
            "where": {
                "ReadbookId": readbook.id
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
});

router.put('/:postid', function(req, res) {
    Model.Post.findOne({
        "where": {
            "id": req.params["postid"]
        }
    }).then(function(post) {
        // 해당아이디의 포스트가 없을 경우 에러 처리
        post.update({
            content: req.body.content,
            page: req.body.page,
            imagepath: req.body.imageUrl,
            theme: req.body.theme,
            type: req.body.type
    }).then(function(post) {
        res.send({
            "message": {
                "result": {
                    "post": post 
                    }
                }
            });
        });
    });
});

module.exports = router;
