var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

describe('BaseFactory', function() {

    beforeEach(angular.mock.module('intelligence-web-client'));

    it('should exist', inject(function(BaseFactory) {

        expect(BaseFactory).to.exist;
    }));

    describe('parallelGet', () => {
        let query,
            httpBackend,
            endpoint,
            resource;

        beforeEach(inject([
            'config',
            'GamesFactory',
            '$httpBackend',
            (
                config,
                games,
                $httpBackend) =>
                {
                games = games;
                resource = games.extend({});
                query = {
                    count: resource.PAGE_SIZE,
                    isDeleted: false,
                    start: 0
                };
                httpBackend = $httpBackend;
                endpoint = `${config.api.uri}${resource.description}`;
            }
        ]));

        afterEach(function() {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it.only('should return the right number of results', inject([
            'GamesFactory',
            (games, done) => {
                const PAGE_SIZE = resource.PAGE_SIZE;
                const TOTAL_COUNT = 2;
                let expectedQuery = `${endpoint}?count=${PAGE_SIZE}&isDeleted=false&start=0`;
                httpBackend.when('HEAD', expectedQuery).respond({}, {'X-total-count': TOTAL_COUNT});
                httpBackend.when('GET', expectedQuery).respond([
                    {id: 1},
                    {id: 2}
                ]);

                let numberResources = null;
                resource.parallelGet(query).then( () => {
                    let expectedResources = games.getList(expectedQuery);
                    numberResources = expectedResources.length;
                    expect(numberResources).to.not.be.null;
                    expect(numberResources).to.equal(TOTAL_COUNT);
                });
                httpBackend.flush();

        }]));
    });

});
