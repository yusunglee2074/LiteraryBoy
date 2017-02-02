# Literary Periods Server

### server info

### branch
* **master** : 실서버
* **develop** : 개발서버
* **feature/** : 기능별로 피쳐 브랜치 생성
    * 기능 개발 후 develop 브랜치로 pull request 생성

### config
* 개발환경
    * language : node.js 6.9.4
* 배포환경


### feature/express-skeleton

#### Express - 튜토리얼
설치 [x]
Hello World [x]
express 생성기 [x]
기본 라우팅 [x]
정적 파일 [x]
자주 묻는 질문 []


#### 문제 해결

1. 익스프레스 제너레이터 설치시 우분투 폴더 권한 문제

<https://docs.npmjs.com/getting-started/fixing-npm-permissions>
위 사이트에서 본 2번 방법으로 해결
npm의 디폴트 디렉토리를 변경


2. 터미널에 express 쳐도 'express: command not found' 란 오류 메세지만 나옴
~/.zshrc 에 express 설치 폴더 안의 bin폴더를 PATH에 추가해줌




라우트 매개변수

라우트 일부를 가변 매개변수로 바꾸는 방법이다.
app.get('/staff/:name' .....
:name은 일치한 문자열을 키 name으로 삼아 req.params 객체에서 값을 찾는다.
