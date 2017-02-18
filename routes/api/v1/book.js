var express = require('express');
var async = require('async');
var daum = require('../../../util/daum');
var router = express.Router();

router.get('/search', function(req, res, next) {
    console.log(req.query);
    daum.search(req.query.q, function(error, response, body) {
        var bodyObject = JSON.parse(body);
        console.log(bodyObject.channel.item.length);
        res.send(bodyObject.channel.item);
    });
});

module.exports = router;
