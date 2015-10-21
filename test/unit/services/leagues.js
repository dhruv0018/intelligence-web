var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

describe('LeaguesFactory', function() {

    beforeEach(angular.mock.module('intelligence-web-client'));

    it('should exist', inject(function(LeaguesFactory) {

        expect(LeaguesFactory).to.exist;
    }));

    it('should have public API', inject(function(LeaguesFactory) {

        expect(LeaguesFactory).to.respondTo('belongsToYardFormatWhitelist');
    }));

    it('belongsToYardFormatWhitelist should validate the config whitelist', inject(function(LeaguesFactory, config) {

        const whitelist = config.yardFormatLeagueIdsWhitelist;

        whitelist.forEach(leagueId => {

            const league = {
                id: leagueId
            };

            LeaguesFactory.belongsToYardFormatWhitelist(league).should.be.true;
        });

        // No leagues have ID of 0
        const league = {
            id: 0
        };

        LeaguesFactory.belongsToYardFormatWhitelist(league).should.be.false;
    }));
});
