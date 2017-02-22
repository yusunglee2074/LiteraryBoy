var request = require('request');
/*
var appConfig = require('../config/app.json')[process.env.NODE_ENV];
var apiKey = appConfig.api.daum;
 */
var apiKey = "846b27e534c10bce39055515f75d57a7";

module.exports = {
    search: function(query, callback) {
        request({
            uri : "https://apis.daum.net/search/book?apikey=" + apiKey + "&q=" + encodeURI(query) + "&output=json&searchType=title&result=20",
            method : "get",
        }, function (error, response, body) {
            // console.log(error, response, body);
            callback(error, response, body);
        });
    }
};
