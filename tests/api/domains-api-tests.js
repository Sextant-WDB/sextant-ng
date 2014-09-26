var port = require('../../server').port;

var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var expect = chai.expect;

var id;

describe('The REST API for domains', function() {

	it('Doesn\'t let me get domains without signing on', function(done) {
		chai.request('http://localhost:' + port)
		.get('/api/0_0_1/domains')
		.res(function(res) {
			expect(res).to.have.status(401);
			done();
		});
	});

	it('Doesn\'t let me add domains without signing on', function(done) {
		chai.request('http://localhost:' + port)
		.post('/api/0_0_1/domains/random')
		.res(function(res) {
			expect(res).to.have.status(401);
			done();
		});
	});

});