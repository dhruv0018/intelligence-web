var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

describe('BaseFactory', function() {

    beforeEach(angular.mock.module('intelligence-web-client'));

    it('should exist', inject(function(BaseFactory) {

        expect(BaseFactory).to.exist;
    }));

    describe('totalCount', () => {
        let query,
            httpBackend,
            endpoint,
            resourceFactory = 'UsersFactory',
            resource;

        beforeEach(inject([
            'config',
            resourceFactory,
            '$httpBackend',
            (
                config,
                resources,
                $httpBackend) =>
                {
                resources = resources;
                resource = resources.extend({});
                query = {
                    count: resource.PAGE_SIZE,
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

        it('should return the right number of results', inject([
            resourceFactory,
            resources => {
                const PAGE_SIZE = resource.PAGE_SIZE;
                const TOTAL_COUNT = 2;
                let expectedQuery = `${endpoint}?count=${PAGE_SIZE}&start=0`;
                httpBackend.when('HEAD', expectedQuery).respond({}, {'X-total-count': TOTAL_COUNT});

                let numberResources = null;
                resource.totalCount(query).then( count => {
                    expect(count).to.equal(TOTAL_COUNT);
                });
                httpBackend.flush();

        }]));
    });

});
