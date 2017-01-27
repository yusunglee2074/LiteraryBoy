// 오늘의 운세 리스트
var fortunes = [
	'운이 좋당 ㅋㅋ',
	'운이 좋지 못해',
	'운이 진짜 좋아',
	'집밖에 나가지 말 것',
	'연애운이 100점',
	'연애운이 0점',
];
exports.getFortune = function() {
	var idx = Math.floor(Math.random() * fortunes.length);
	return fortunes[idx];
};
