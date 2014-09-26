var port = require('../../server').port;

var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var expect = chai.expect;

var firstID,
	secondID,
	jwt;

describe('The REST API for users', function() {

	it('Can create a new user', function(done) {

		chai.request('http://localhost:' + port)
		.post('/api/0_0_1/users')
		.req(function(req) {
			req.send({
				"email": "fakeaddress@fake.com",
				"password": "123"
			});
		})
		.res(function(res) {
			expect(res).to.have.status(200);
			firstID = res.body._id;
			done();
		});

	});

	it('Returns a JWT', function(done) {

		chai.request('http://localhost:' + port)
		.post('/api/0_0_1/users')
		.req(function(req) {
			req.send({
				"email": "fakeaddress2@fake.com",
				"password": "123"
			});
		})
		.res(function(res) {
			expect(res).to.have.status(200);
			expect(res.body).to.have.property('jwt');
			jwt = res.body.jwt;
			secondID = res.body._id;
			done();
		});

	});

	it('Can update a user', function(done) {

		chai.request('http://localhost:' + port)
		.put('/api/0_0_1/users/' + secondID)
		.req(function(req) {
			req.send({
				basic: {
					"email": "fakeaddress3@fake.com"
				}
			});
		})
		.res(function(res) {
			expect(res).to.have.status(202);
			expect(res.body.basic.email).to.eql('fakeaddress3@fake.com');
			done();
		});

	});

	it('Rejects duplicate users', function(done) {

		chai.request('http://localhost:' + port)
		.post('/api/0_0_1/users')
		.req(function(req) {
			req.send({
				"email": "fakeaddress@fake.com",
				"password": "123"
			});
		})
		.res(function(res) {
			expect(res).to.have.status(401);
			expect(res.body.message).to.eql('cannot create user');
			done();
		});

	});

	it('Can delete users', function(done) {

		chai.request('http://localhost:' + port)
		.del('/api/0_0_1/users/' + firstID)
		.res(function(res) {
			expect(res).to.have.status(200);
			expect(res.body.message).to.eql('deleted');
		});

		chai.request('http://localhost:' + port)
		.del('/api/0_0_1/users/' + secondID)
		.res(function(res) {
			expect(res).to.have.status(200);
			expect(res.body.message).to.eql('deleted');
			done();
		});

	});

});