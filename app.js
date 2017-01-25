var express = require('express');
// require는 다른 언어의 import 같은 키워드다.
// 이는 패키지 이름을 문자열 인수로 취해 패키지를 반환한다.
// express 모듈 호출

var app = express();
// Express 함수 "express()"를 호출해 변수 app에 담는다.
// "express()"는 클래스와 같고, app은 객체라고 생각할 수도 있다.

app.get('/', function (req, res){
  res.send('<h2>hello world~</h2>');
});
// 여기서 function() {}는 핸들러 함수이며 앞의 라우트 '/'와 일치하면 실행된다.
// req와 res는 리퀘스트와 리스폰스이며 각각의 쿼리스트링, 파라미터, 바디, HTTP 해더등을 가지고있는 객체이다.
// res.send 메소드는 바디에 해당 내용을 붙인다.

app.listen(3000, function () {
  console.log('Example app listening on port 3000');
});
// app.listen 메소드는 해당 주어진 포트번호에서 수신을 대기한다.
