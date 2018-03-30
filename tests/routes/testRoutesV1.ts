import * as frisby from 'frisby';
const Joi = frisby.Joi;
const BASE_API = "http://127.0.0.1:3000/api/v1/urls"

describe('GET api/v1/urls', function() {
    it("Should return status 404 when missing shortened_url query", function(done) {
        frisby.get(BASE_API)
                .expect('status', 404)
                .expect('jsonTypes', {
                    status: Joi.number(),
                    message: Joi.string()
                })
                .expect('json', {
                    status: 404,
                    message: "Not found this shortened url!"
                })
                .done(done);
    });

    it("Should return status 404 when user url does not exist in database", function(done) {
        frisby.get(BASE_API + '?shortened_url=https://asia-1.bit.ly/xxxxx')
                .expect('status', 404)
                .expect('jsonTypes', {
                    status: Joi.number(),
                    message: Joi.string()
                })
                .expect('json', {
                    status: 404,
                    message: "Not found this shortened url!"
                })
                .done(done);
    });

    it("Should return status 404 when user url not valid", function(done) {
        frisby.get(BASE_API + '?shortened_url=.bit.ly/xxxxx')
                .expect('status', 404)
                .expect('jsonTypes', {
                    status: Joi.number(),
                    message: Joi.string()
                })
                .expect('json', {
                    status: 404,
                    message: "Not found this shortened url!"
                })
                .done(done);
    });
});

describe('POST api/v1/urls', function() {
    it("Should return status 409 when user url already exist", function(done) {
        frisby.post(BASE_API, {
                    region: "eu",
                    user_url: "http://example.com"
                }, { json: true })
                .expect('status', 409)
                .expect('jsonTypes', {
                    status: Joi.number(),
                    message: Joi.string()
                })
                .expect('json', {
                    status: 409,
                    message: "User url already exist."
                })
                .done(done);
    });

    it("Should return status 400 when user url is invalid", function(done) {
        frisby.post(BASE_API, {
                    region: "eu",
                    user_url: "example.com"
                }, { json: true })
                .expect('status', 400)
                .expect('jsonTypes', {
                    status: Joi.number(),
                    message: Joi.string()
                })
                .expect('json', {
                    status: 400,
                    message: "User url is invalid."
                })
                .done(done);
    });

    it("Should return status 400 when region is invalid", function(done) {
        frisby.post(BASE_API, {
                    region: "we",
                    user_url: "http://example.com"
                }, { json: true })
                .expect('status', 400)
                .expect('jsonTypes', {
                    status: Joi.number(),
                    message: Joi.string()
                })
                .expect('json', {
                    status: 400,
                    message: "This region currently does not supported."
                })
                .done(done);
    });
});