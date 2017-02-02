var express = require('express');
var fortune = require('./lib/fortune.js');
var getWeatherData = require('./lib/getWeatherData.js');
var app = express();
var formidable = require('formidable');
var fs = require('fs')

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

// 쿠키 시크릿 연결
var credentials = require('./credentials.js');
app.use(require('cookie-parser')(credentials.cookieSecret));

// 익스프레서 세션설 치후 express-session 연결
app.use(require('express-session')({
	resave: false,
	saveUninitialized: false,
	secret: credentials.cookieSecret
}));

// body-parser 미들웨어
app.use(require('body-parser').urlencoded({ extended: true}));

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


// 데이터베이스 설정
var mongoose = require('mongoose');
var opts = {
	server: {
		socketOptions: { keepAlive: 1 }
	}
};
switch(app.get('env')){
	case 'development':
	    mongoose.connect(credentials.mongo.development.connectionString, opts);
		break;
	case 'production':
	    mongoose.connect(credentials.mongo.production.connectionString, opts);
		break;
	default:
	    throw new Error('Unknown execution environment: ' + apt.get('env'));
}

// 실습을 위한 초기 데이터 데이터베이스에 쓰기
var Vacation = require('./models/vacation.js');
Vacation.find(function(err, vacations){
    if(vacations.length) return;
	console.log('베케이션 만들기 시작')

    new Vacation({
        name: 'Hood River Day Trip',
        slug: 'hood-river-day-trip',
        category: 'Day Trip',
        sku: 'HR199',
        description: 'Spend a day sailing on the Columbia and ' + 
            'enjoying craft beers in Hood River!',
        priceInCents: 9995,
        tags: ['day trip', 'hood river', 'sailing', 'windsurfing', 'breweries'],
        inSeason: true,
        maximumGuests: 16,
        available: true,
        packagesSold: 0,
    }).save();

    new Vacation({
        name: 'Oregon Coast Getaway',
        slug: 'oregon-coast-getaway',
        category: 'Weekend Getaway',
        sku: 'OC39',
        description: 'Enjoy the ocean air and quaint coastal towns!',
        priceInCents: 269995,
        tags: ['weekend getaway', 'oregon coast', 'beachcombing'],
        inSeason: false,
        maximumGuests: 8,
        available: true,
        packagesSold: 0,
    }).save();

    new Vacation({
        name: 'Rock Climbing in Bend',
        slug: 'rock-climbing-in-bend',
        category: 'Adventure',
        sku: 'B99',
        description: 'Experience the thrill of rock climbing in the high desert.',
        priceInCents: 289995,
        tags: ['weekend getaway', 'bend', 'high desert', 'rock climbing', 'hiking', 'skiing'],
        inSeason: true,
        requiresWaiver: true,
        maximumGuests: 4,
        available: false,
        packagesSold: 0,
        notes: 'The tour guide is currently recovering from a skiing accident.',
    }).save();
});

// notify-me-when-season 라우터 핸들러
var VacationInSeasonListener = require('./models/vacationInSeasonListener.js');

app.get('/notify-me-when-in-season', function(req, res){
	res.render('notify-me-when-in-season', { sku: req.query.sku });
});

app.post('/notify-me-when-in-season', function(req, res){
    VacationInSeasonListener.update(
        { email: req.body.email }, 
        { $push: { skus: req.body.sku } },
        { upsert: true },
	    function(err){
	        if(err) {
	        	console.error(err.stack);
	            req.session.flash = {
	                type: 'danger',
	                intro: 'Ooops!',
	                message: 'There was an error processing your request.',
	            };
	            return res.redirect(303, '/vacations');
	        }
	        req.session.flash = {
	            type: 'success',
	            intro: 'Thank you!',
	            message: 'You will be notified when this vacation is in season.',
	        };
	        return res.redirect(303, '/vacations');
	    }
	);
});


// 스태틱 미들웨어 추가
app.use(express.static(__dirname + '/public'));

// 세션을 이용한 플래시 메세지 구현
// flash 객체가 있다면 뷰에 추가하게 만든다. 플래시 메세지를 표시했다면
// 세션에서 제거 해서 다음 요청에는 표시되지 않게 한다.
app.use(function(req, res, next){
	res.locals.flash = req.session.flash;
	delete req.session.flash;
	next();
});


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

// 노드의 파일 시스템 예제
// 디렉터리가 존재하는지 확인하고 없으면 만든다.
var dataDir = __dirname + '/data';
var vacationPhotoDir = dataDir + '/vacation-photo';
fs.existsSync(dataDir) || fs.mkdirSync(dataDir);
fs.existsSync(vacationPhotoDir) || fs.mkdirSync(vacationPhotoDir);

function saveContestEntry(contestName, email, year, month, photoPath){
	// pass
}

// 이미지를 받을 수 있는 페이지 formidable 사용함!
app.get('/contest/vacation-photo', function(req,res){
	var now = new Date();
	res.render('contest/vacation-photo', {
		year: now.getFullYear(), month: now.getMonth()
	});
});

app.post('/contest/vacation-photo/:year/:month', function(req, res){
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files){
		if(err) {
			res.session.flash = {
				type: 'danger',
				intro: 'Oops!',
				message: 'There was an error processing your submission. ' +
				    'Please try again.',
			};
			return res.redirect(303, '/contest/vacation-photo');
		}
		var photo = files.photo;
		var dir = vacationPhotoDir + '/' + Date.now();
		var path = dir + '/' + photo.name;
		fs.mkdirSync(dir);
		fs.renameSync(photo.path, dir + '/' + photo.name);
		saveContestEntry('vacation-photo', fields.email,
		   req.params.year, req.params.month, path);
		req.session.flash = {
			type: 'success',
			intro: 'Good luck!',
			message: '콘테스트에 들어오셨어영',
		};
		return res.redirect(303, '/contest/vacation-photo/entries');
	});
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

// thank-you 페이지
app.get('/thank-you', function(req, res){
	res.render('thank-you');
});

// 현재 예약 가능한 패키지만 보여주기
app.get('/vacations', function(req, res){
	console.log('1')
	Vacation.find({ available: true }, function(err, vacations){
		var context = {
			vacations: vacations.map(function(vacation){
				return {
					sku: vacation.sku,
					name: vacation.name,
					description: vacation.description,
					price: vacation.getDisplayPrice(),
					inSeason: vacation.inSeason,
				}
			})
		};
		res.render('vacations', context);
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


