const express = require('express');
const router = express.Router();
const request = require('request');
const models = require('../models');

// 알라딘 api를 사용해서 책 isbn을 넣으면 내부db에 해당 책을 입력합니다.
// 이미지는 어디서 가져오는가? 유저는 어떻게 연결하지?
router.post('/make_book', function(req, res) {
	const queryISBN = req.query['isbn'];
	var options = {
		url: 'http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx',
		qs: {
			'ttbkey': 'ttblys30301617002',
			'itemIdType': 'ISBN13',
			'output': 'js',
			'ItemId': queryISBN,
			'Cover': 'Big'
		}
	};
	
	function callback(error, response, body) {
			console.log(body);
			models.Book.create({
				title: body.item.title,
				page: body.item.bookinfo.itemPage,
				isbn: body.item.isbn13,
				author: body.item.author,
				publisher: body.item.publisher,
				thumbnailimage: body.item.cover,
				highimage: '임시주소',
				published_date: body.item.pubDate
			}).then(function(book) {
			    console.log(book.title, "생성되었습니다.")
				return book 
			});
		}
	request(options, callback);
});

module.exports = router;

