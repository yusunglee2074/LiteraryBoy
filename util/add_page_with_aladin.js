var request = require('request');
var TTBKey = 'ttblys30301617002'; 

    var page_search = function(isbn13, callbackyuyuyu) {
        request({
            uri : "http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=" + TTBKey + "&itemIdType=ISBN13&ItemId=" + encodeURI(isbn13) + "&output=JS",
            method : "get"
        }, function (error, response, body) {
            var jsonObject = null;
            if (body.length > 0) {
                try {
                    jsonObject = JSON.parse(jsonEscape(body));
                } catch(e) {
                    eval("jsonObject = " + body);
                }
            }
            callbackyuyuyu(error, response, body, jsonObject);
        });
    };


/*
var isbn = "9791186634684";

page_search(isbn,function(error, response, body) {
    console.log(body.length);
    console.log(body);
    if (body.match(/;$/)) {
        body = body.replace(/;$/, '');
        // body = jsonEscape(body);
        eval("body = " + body);
        try {
           var json = JSON.parse(body);
            console.log(JSON.parse(body));
        } catch(e) {
            console.log(e);
           // console.log('invalid json');
           console.log("-----", body);
        }
    }
});
*/

function jsonEscape(str)  {
    return str.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t").replace(/;$/, '');
}
