var express = require('express');
var async = require('async');
var daum = require('../../../util/daum');
var router = express.Router();
var Model = require('../../../models');


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

module.exports = router;
