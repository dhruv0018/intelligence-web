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

describe('BaseFactory.retrieve', () => {

    let $httpBackend;
    let TeamsFactory;
    let config;
    let teamRetrieve;
    let teamsGETURL;
    const queryParams = {
        'id[]': [12345, 67890]
    };

    beforeEach(angular.mock.module('intelligence-web-client'));

    beforeEach(inject(function ($injector) {

        $httpBackend = $injector.get('$httpBackend');
        TeamsFactory = $injector.get('TeamsFactory');
        config = $injector.get('config');
        teamsGETURL = `${config.api.uri}teams?id%5B%5D=12345&id%5B%5D=67890`;

        teamRetrieve = $httpBackend.when('GET', teamsGETURL);
    }));

    afterEach(function () {

        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it(`should return a promise`, done => {

        teamRetrieve.respond([
            { id: 12345 },
            { id: 67890 }
        ]);

        TeamsFactory.retrieve(queryParams)
            .then(response => {

                expect(response).to.be.an.array;
                expect(response).to.have.length(2);
                expect(response[0]).to.have.property('id');
                expect(response[0].id).to.equal(12345);
                expect(response[1]).to.have.property('id');
                expect(response[1].id).to.equal(67890);

                done();
            });

        $httpBackend.flush();
    });
});
