var express = require('express');
var fortune = require('./lib/fortune.js');
var getWeatherData = require('./lib/getWeatherData.js');
var app = express();

// 환경별 로거를 불러오는 것을 다르게함. 
switch(app.get('env')){
	case 'development':
	    app.use(require('morgan')('dev'));
		break;
	case 'production':
	    app.use(require('express-logger')({
			path:__dirname + '/log/requests.log'
		}));
		break;
}

// 도메인(영역)을 이용한 에러가 일어나더라도 서버를 우아하게 닫아버리는 미들웨어
app.use(function(req, res, next){
	// 이 요청을 처리할 도메인 생성
	var domain = require('domain').create();
	// 도메인에서 일어난 에러 처리
	domain.on('error', function(err){
		console.error('DOMAIN ERROR CAUGHT\n', err.stack);
		try {
			// 5초 후에 안전한 셧다운
			setTimeout(function(){
				console.error('Failsafe shutdown.');
				process.exit(1);
			}, 5000);

			// 클러스터 연결 해제
			var worker = require('cluster').worker;
			if(worker) worker.disconnect();

			// 요청을 받는 것을 중지
			server.close();
			try {
				// 익스프레스의 에러 라우트 시도
				next(err);
			} catch(err){
				// 익스프레스의 에러 라우트가 실패하면
				// 일반 노드 응답 사용
				console.error('Express error mechanism failed. \n', err.stack);
				res.statusCode = 500;
				res.setHeader('content-type', 'text/plain');
				res.end('Server error. ');
			}
		} catch(err){
			console.error('Unable to send 500 response. \n', err.stack);
		}
	});
	domain.add(req);
	domain.add(res);

	// 나머지 요청 체인을 도메인에서 처리
	domain.run(next);
});

// 스태틱 미들웨어 추가
app.use(express.static(__dirname + '/public'));

// body-parser 미들웨어
app.use(require('body-parser').urlencoded({ extended: true}));

// 날씨 더미 데이터를 res.locals.partials 객체에 주입할 미들웨어 생성
app.use(function(req, res, next){
	if(!res.locals.partials) res.locals.partials = {};
	res.locals.partials.weatherContext = getWeatherData.getWeatherData();
	next();
});

// HTML에 추가적인 컨텐츠를 주입해주는 핸들바 뷰 엔진 설정
var handlebars = require('express-handlebars').create({
	defaultLayout:'main',
	helpers: {
		section: function(name, options){
			if(!this._sections) this._sections = {};
			this._sections[name] = options.fn(this);
			return null;
		}
	}
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

// 쿼리스트링에 ?test=1이 들어 있는지 감지할 미들웨어 사용을 위한 미들웨어 추가
app.use(function(req, res, next){
		res.locals.showTests = app.get('env') !== 'production' &&
		    req.query.test === '1';
		next();
});

// home Page
app.get('/', function(req, res){
		res.render('home');
});

// About 페이지
app.get('/about', function(req, res){
		res.render('about', { 
            fortune: fortune.getFortune(),
			pageTestScript: '/qa/tests-about.js'
			} );
});

// 이메일 주소를 받는 폼 페이지
app.get('/newsletter', function(req, res){
	res.render('newsletter', { csrf: 'CSRF token goes here' });
});

app.post('/process', function(req, res){
	console.log('Form (from querystring): ' + req.query.form);
	console.log('CSRF token (from hidden form field): ' + req.body._csrf);
	console.log('Name (from visible form field): ' + req.body.name);
	console.log('Email (from visible form field): ' + req.body.email);
	res.redirect(303, '/thank-you');
});
	

// 에러를 발생시켜 보자.
app.get('/fail', function(req, res){
	throw new Error('Nope!');
});
// 서버를 다운시켜버리는 에러를 발생시켜 보자.
app.get('/epic-fail', function(req, res){
	process.nextTick(function(){
		throw new Error('퍼겊거헉허거헢퍼!!!!!서버터지는소리');
	});
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

// 에러 핸들러
app.use(function(err, req, res, next){
	console.error(err.stack);
	app.status(500).render('500');
});

// 앱 모듈화를 위한 구문
function startServer() {
	app.listen(app.get('port'), function() {
		console.log( 'Express started in ' + app.get('env') +
		    ' mode on http://localhost:' + app.get('port') +
			'; press 컨트롤C 하면 꺼져버림' );
	});
}
if(require.main === module){
	// 애플리케이션은 앱 서버를 시동해 직접 실행된다.
	startServer();
} else {
	// require를 통해 애플리케이션을 모듈처럼 가져옵니다.
	// 함수를 반환해서 서버를 생성합니다.
	module.exports = startServer;
}


