var request = require('request');
var appConfig = require('../config/app.json')[process.env.NODE_ENV];
var apiKey = appConfig.api.daum;

module.exports = {
    search: function(query, callback) {
        request({
            uri : "https://apis.daum.net/search/book?apikey=" + apiKey + "&q=" + encodeURI(query) + "&output=json",
            method : "get",
        }, function (error, response, body) {
            // console.log(error, response, body);
            callback(error, response, body);
        });
    }
};
