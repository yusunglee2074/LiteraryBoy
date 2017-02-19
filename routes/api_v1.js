var express = require('express');
var router = express.Router();

/* GET home page. */
router.all('/test', function(req, res, next) {
    res.send({
        uri : req.baseUrl + req.path,
        method : req.method,
        origin : {
            params : req.params,
            body : req.body,
            query : req.query
        }
    });
});
router.all('/bookId/:isbn/my', function(req, res, next) {
    res.send({
        uri : req.baseUrl + req.path,
        method : req.method,
        origin : {
            params : req.params,
            body : req.body,
            query : req.query
        }
    });
});
router.all('/bookId/:isbn/other', function(req, res, next) {
    res.send({
        uri : req.baseUrl + req.path,
        method : req.method,
        origin : {
            params : req.param['isbn']
            body : req.body,
            query : req.query
        }
    });
});

module.exports = router;
