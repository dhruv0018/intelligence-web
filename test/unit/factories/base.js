var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

describe('BaseFactory', function() {

    beforeEach(angular.mock.module('intelligence-web-client'));

    it('should exist', inject(function(BaseFactory) {

        expect(BaseFactory).to.exist;
    }));

    describe.only('parallelGet', () => {
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
                query = {};
                games = games;
                resource = games.extend({});
                httpBackend = $httpBackend;
                endpoint = `${config.api.uri}${resource.description}`;
            }
        ]));

        it('should return a promise', inject([
            'GamesFactory',
            (games) => {
                const PAGE_SIZE = resource.PAGE_SIZE;
                let firstPage = `${endpoint}?count=${PAGE_SIZE}&isDeleted=false&start=0`;
                httpBackend.when('HEAD', endpoint).respond({}, {'X-total-count': 2});
                httpBackend.when('GET', firstPage).respond([
                    {id: 1},
                    {id: 2}
                ]);
                resource.parallelGet(query).then( () => {
                    let expectedResource = games.get(1);
                    expect(expectedResource).to.not.be.null;
                });
                httpBackend.flush();
        }]));
    });

});
