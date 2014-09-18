var port = require('../../server').port;

var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var expect = chai.expect;

var id;

describe('The data REST API', function() {

	it('Doesn\'t let me get data without signing on', function(done) {
		chai.request('http://localhost:' + port)
		.get('/api/0_0_1/data')
		.res(function(res) {
			expect(res).to.have.status(401);
			done();
		});
	});

	it('Lets me add data', function(done) {
		chai.request('http://localhost:' + port)
		.post('/api/0_0_1/data')
		.req(function(req) {
			req.send({ "url": "test.com" });
		})
		.res(function(res) {
			expect(res).to.have.status(200);
			expect(res.body).to.have.property('_id');
			expect(res.body.url).to.eql('test.com');
			id = res.body._id;
			done();
		});
	});

	it('Lets me update data', function(done) {
		chai.request('http://localhost:' + port)
		.put('/api/0_0_1/data/' + id)
		.req(function(req) {
			req.send({ "url": "newtest.com" });
		})
		.res(function(res) {
			expect(res).to.have.status(202);
			expect(res.body.url).to.eql('newtest.com');
			done();
		});
	});

	it('Lets me delete data', function(done) {
		chai.request('http://localhost:' + port)
		.del('/api/0_0_1/data/delete/' + id)
		.res(function(res) {
			expect(res).to.have.status(200);
			expect(res.body.message).to.eql('deleted');
			done();
		});
	});

});