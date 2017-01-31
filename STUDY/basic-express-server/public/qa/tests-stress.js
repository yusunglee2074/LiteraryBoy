var loadtest = require('loadtest');
var expect = require('chai').expect;

suite('Stress tests', function(){
	test('50번 1초에', function(done){
		var options = {
			url: 'http://localhost:3000',
			concurrency: 4,
			maxRequests: 50
		};
		loadtest.loadTest(options, function(err, result){
			expect(!err);
			expect(result.totalTimeSeconds < 1);
			done();
		});
	});
});

