var port = require('../../server').port;

var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var expect = chai.expect;

var id;

describe('The REST API for write keys', function() {

	it('Doesn\'t give me a write key if I\'m not authorized', function(done) {
		chai.request('http://localhost:' + port)
		.post('/api/0_0_1/provisionKeys')
		.res(function(res) {
			expect(res).to.have.status(401);
			done();
		});
	});

});