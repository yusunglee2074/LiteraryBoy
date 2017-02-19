var express = require('express');
var async = require('async');
var daum = require('../../../util/daum');
var router = express.Router();
var Model = require('../../../models');


// console.log( Model.Book.findAll() );

if (false) {
    Model.User.findOne({
        "where": {
            "id": 1
        }
    }).then(function (user) {
        console.log(user.get('nickname'));
        Model.Book.findOne({
            "where": {
                "isbn13" : "9788965132288"
            }
        }).then(function (book) {
            // console.log(book.get('isbn13'));
            // console.log(book.get('id'));
            Model.Readbook.create({
                "BookId": book.get("id"),
                "UserId": user.get("id")
            })
        });
    })
}

Model.Readbook.findOne({
    "where" : {
        "UserId": user.get("id"),
        "isbn13": req.param.isbn
    }
}).then(function(readBook) {
});
