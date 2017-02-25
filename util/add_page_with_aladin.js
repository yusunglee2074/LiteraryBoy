var request = require('request');
var TTBKey = 'ttblys30301617002'; 

module.exports = {
    page_search: function(isbn13, callbackyuyuyu) {
        request({
            uri : "http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=" + TTBKey + "&itemIdType=ISBN13&ItemId=" + encodeURI(isbn13) + "&output=JS",
            method : "get",
        }, function (error, response, body) {
            callbackyuyuyu(error, response, body);
        });
    }
}
