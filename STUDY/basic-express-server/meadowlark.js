var express = require('express');

var app = express();
// 스태틱 미들웨어 추가
app.use(express.static(__dirname + '/public'));

// HTML에 추가적인 컨텐츠를 주입해주는 핸들바 뷰 엔진 설정
var handlebars = require('express-handlebars')
	.create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

app.get('/', function(req, res){
		res.render('home');
});

// 오늘의 운세 리스트
var fortunes = [
	'운이 좋당 ㅋㅋ',
	'운이 좋지 못해',
	'운이 진짜 좋아',
	'집밖에 나가지 말 것',
	'연애운이 100점',
	'연애운이 0점',
];
app.get('/about', function(req, res){
		var randomFortune = 
		    fortunes[Math.floor(Math.random() * fortunes.length)];
		res.render('about', { fortune: randomFortune });
});

// 커스템 500페이지
app.use(function(err, req, res, next){
		console.error(err.stack);
		res.status(500);
		res.render('500');
});

// 커스텀 404 페이지
app.use(function(req, res){
		res.status(404);
		res.render('404');
});

app.listen(app.get('port'), function(){
		console.log( '익스프레스 실행됬다 여기에서 ===' + 
				app.get('port') + '; 컨트롤 C 누르면 종료한다.' );
});
