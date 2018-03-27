var assert = require('assert');
var request = require('request')

const BASE_URL = "http://127.0.0.1:3000";

/**
 * Test Internet connection 
 */
describe("Internet Connection", function() {
    it("should be alive", function(done) {
        request
        .get('http://google.com/')
        .on('response', function(response) {
            assert(response.statusCode == 200, "Status code was not 200: " + response.statusCode.toString());
            done();
        })
    });
})

describe('API', function() {
    describe("/sources", function() {
        describe("/", function() {
            it("should return all sources with no additional  parameters", function(done) {
                request
                .post(BASE_URL + "/api/sources/")
                .on('response', function(response) {
                    data = ""
                    assert(response.statusCode == 200, "Status code was not 200: " + response.statusCode.toString());
                    response.on('data', function(chunk) {
                        data += chunk
                    })
                    response.on('end', function() {
                        data = JSON.parse(data);
                        assert(Array.isArray(data), "returned data should be a list of objects");
                        for (var key in data) {
                            let currentSource = data[key];
                            assert(currentSource.id != undefined, "Id is undefined in the return data")
                        }
                        done()
                    })
                })
            });

            it("should return only one source with a specific id", function(done) {
                requestBody = {
                    query: {
                        id : "abc-news"
                    }, 
                    selects: {}
                };
                request
                .post({ url: BASE_URL + "/api/sources/", body: requestBody, json: true})
                .on("response", function(response) {
                    data = ""
                    assert(response.statusCode == 200, "Status code was not 200: " + response.statusCode.toString());
                    response.on('data', function(chunk) {
                        data += chunk
                    })
                    response.on('end', function() {
                        data = JSON.parse(data);
                        assert(data.length == 1, "Only one object should be returned with the given id");
                        assert(data[0].id == requestBody.query.id, "Wrong ID returned");
                        done();
                    })
                })
            })
        });

        describe("/batchUpdate", function() {

        });
    });
});
