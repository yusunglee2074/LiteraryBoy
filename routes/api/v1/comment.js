var express = require('express');
var router = express.Router();
var Model = require('../../../models');
var sequelize = require('sequelize')


router.post('/:POSTID', function(req, res) {
	Model.Post.findOne({
		"where": {
			"id": req.params['POSTID']
		}
	}).then(function(post) {
        if(!post) {
            res.send({
                "message": {
                    "result": {
                        "post": {}
                     }
                 }
            });
        } else {
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
                    Model.Comment.create({
                        "content": req.body.content,
                        "UserId": user.id,
                        "PostId": post.id
                    }).then(function(comment) {
                        res.send({
                            "message": {
                                "result": {
                                    "comment": comment 
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



router.delete('/:commentId', function(req, res) {
	Model.Comment.findOne({
		"where": {
			"id": req.params['commentId']
		}
	}).then(function(comment) {
        if (!comment) {
            res.send({
                "message": {
                    "result": {
                        "comment": {}
                     }
                 }
            });
        } else {
            // 자신의 것이 아닌 코멘트는 삭제 안되게 해야함
            comment.destroy()
        }
	}).then(function() {
		res.send({
			"message": "삭제성공했습니다."
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
});

router.get('/:postId/list', function(req, res) {
	Model.Comment.findAll({
		"where": {
			"PostId": req.params['postId']
		}
	}).then(function(comment) {
        if (!comment) {
            res.send({
                "message": {
                    "result": {
                        "comment": {
                            "comments": []
                        }
                     }
                 }
            });
        } else {
            res.send({
                "message": {
                    "result": {
                        "comment": {
                            "comments": comment
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
});

router.get('/my', function(req, res) {
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
            Model.Comment.findAll({
                "where": {
                    "UserId": user.id
                }
            }).then(function(comment) {
                if(!comment) {
                    res.send({
                        "message": {
                            "result": {
                                "comment": {
                                    "comments": []
                                 }
                             }
                        }
                    });
                } else {
                    res.send({
                        "message": {
                            "result": {
                                "comment": {
                                    "comments": comment 
                                 }
                             }
                        }
                    });
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
});

router.put('/:commentId', function(req, res) {
	Model.Comment.findOne({
		"where": {
			"id": req.params['commentId']
		}
	}).then(function(comment) {
        if (!comment) {
            res.send({
                "message": {
                    "result": {
                        "comment": {}
                     }
                 }
            });
        } else {
            comment.update({
                content: req.body.content
            }).then(function(comment) {
                res.send({
                    "message": {
                        "result": {
                            "comment": comment
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
