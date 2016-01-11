var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

describe('GamesResolutionService', function() {

    beforeEach(angular.mock.module('intelligence-web-client'));

    describe('basic functionality', () => {
        it('should exist', inject(function(GamesResolutionService) {
            console.log(GamesResolutionService);
            expect(GamesResolutionService).to.exist;
        }));

        it('should have public API', inject(function(GamesResolutionService) {
            expect(GamesResolutionService).to.have.property('queryFilter');
            expect(GamesResolutionService).to.have.property('start');
            expect(GamesResolutionService).to.have.property('isQuerying');
            expect(GamesResolutionService).to.have.property('totalCount');
            expect(GamesResolutionService).to.respondTo('query');
        }));

        it('should be able to set a queryFilter', inject(function(GamesResolutionService) {
            let filter = {
                status: 1
            };
            GamesResolutionService.queryFilter = filter;
            expect(GamesResolutionService.queryFilter).to.equal(filter);
        }));

        it('should be able to set a start', inject(function(GamesResolutionService) {
            let start = 500;
            GamesResolutionService.start = start;
            expect(GamesResolutionService.start).to.equal(start);
        }));

    });

    describe('query functionality', () => {

        let games,
            game,
            start,
            queryFilter,
            httpBackend,
            endpoint,
            PAGE_SIZE,
            TOTAL_COUNT;

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
                game = games.extend({});
                start = 0;
                queryFilter = {
                    status: 1
                };
                httpBackend = $httpBackend;
                endpoint = `${config.api.uri}${game.description}`;
                PAGE_SIZE = 2;
                TOTAL_COUNT = 2;
            }
        ]));

        xit('should get the proper total count', inject(function(GamesResolutionService) {
            // var queryString = `${endpoint}?start=0&status=1`;
            // httpBackend.when('HEAD', queryString).respond({}, {'X-total-count': TOTAL_COUNT});
            // GamesResolutionService.start = 0;
            // GamesResolutionService.queryFilter = queryFilter;
            //expect(GamesResolutionService.totalCount).to.equal(TOTAL_COUNT);
        }));

    });

});
