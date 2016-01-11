var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

describe.only('GamesResolutionService', function() {

    beforeEach(angular.mock.module('intelligence-web-client'));

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
