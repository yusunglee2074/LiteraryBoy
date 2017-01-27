var express = require('express');

var app = express();

// HTML에 추가적인 컨텐츠를 주입해주는 핸들바 뷰 엔진 설정
var handlebars = require('express-handlebars')
	.create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

app.get('/', function(req, res){
		res.render('home');
});
app.get('/about', function(req, res){
		res.render('about');
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
