var express = require('express');
var async = require('async');
var daum = require('../../../util/daum');
var router = express.Router();
var Model = require('../../../models');


router.get('/search', function(req, res) {
    console.log(req.query);
    daum.search(req.query.keyword, function(error, response, body) {
        var bodyObject = JSON.parse(body);
        console.log(bodyObject.channel.item.length);

        // send
        // res.send(bodyObject.channel.item);

        if (bodyObject.channel.item.length > 0) {
            var respArr = [];
            // save
            async.each(bodyObject.channel.item, function(item, callback) {
                // if exist isbn?
                    // then update or ignore
                // else
                    // save
                respArr.push({
                    "bookId"       : item.isbn13,
                    "name"         : item.title,
                    "author"       : item.author,
                    "pub_nm"       : item.pub_nm,
                    "pub_date"     : Math.round(new Date(item.pub_date.substr(0,4), item.pub_date.substr(4,2) - 1, item.pub_date.substr(6,2)).getTime()/1000),
                    "thumbnailUrl" : item.cover_l_url
                });

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
            res.send([]);
        }
    });
});

module.exports = router;
