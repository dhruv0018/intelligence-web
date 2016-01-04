const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

const moment = require('moment');

describe('LeaguesFactory', function() {

    beforeEach(angular.mock.module('intelligence-web-client'));

    it('should exist', inject(function(LeaguesFactory) {

        expect(LeaguesFactory).to.exist;
    }));

    it('should have public API', inject(function(LeaguesFactory) {

        expect(LeaguesFactory).to.respondTo('getLeaguesBySportId');
        expect(LeaguesFactory).to.respondTo('getCurrentSeason');
    }));

});

describe('LeaguesFactory.getCurrentSeason', () => {

    let LeaguesFactory;

    beforeEach(inject([
        'LeaguesFactory',
        function(_LeaugesFactory_) {
            LeaguesFactory = _LeaugesFactory_;
        }
    ]));

    it('should return the current season of the league', function() {
        let currentDate = moment();
        let league = {
            id: 1,
            seasons: [
                {
                    id: 1,
                    startDate: currentDate - 3000,
                    endDate: currentDate + 3000,
                    leagueId: 1
                },
                {
                    id: 2,
                    startDate: currentDate - 4000,
                    endDate: currentDate - 3000,
                    leagueId: 1
                },
                {
                    id: 3,
                    startDate: currentDate - 5000,
                    endDate: currentDate - 4000,
                    leagueId: 1
                }
            ]
        }

        LeaguesFactory.extend(league);
        let expectedSeasonId = league.seasons[0].id;
        let season = league.getCurrentSeason();
        expect(season).to.be.an('object');
        expect(season.id).to.equal(expectedSeasonId);
        expect(moment(currentDate).isAfter(moment(season.startDate))).to.be.true;
        expect(moment(currentDate).isBefore(moment(season.endDate))).to.be.true;
    });
});

describe('LeaguesFactory.getMostRecentSeason', () => {

    let LeaguesFactory;

    beforeEach(inject([
        'LeaguesFactory',
        function(_LeaugesFactory_) {
            LeaguesFactory = _LeaugesFactory_;
        }
    ]));

    it('should return the most recent season if the league has no current season', function() {
        let currentDate = moment();
        let league = {
            id: 1,
            seasons: [
                {
                    id: 1,
                    startDate: currentDate - 3000,
                    endDate: currentDate - 1000,
                    leagueId: 1
                },
                {
                    id: 2,
                    startDate: currentDate - 4000,
                    endDate: currentDate - 3000,
                    leagueId: 1
                },
                {
                    id: 3,
                    startDate: currentDate - 5000,
                    endDate: currentDate - 4000,
                    leagueId: 1
                }
            ]
        }

        LeaguesFactory.extend(league);
        let expectedSeasonId = league.seasons[0].id;
        let season = league.getMostRecentSeason();
        expect(season).to.be.an('object');
        expect(season.id).to.equal(expectedSeasonId);
        expect(moment(currentDate).isAfter(moment(season.startDate))).to.be.true;
        expect(moment(currentDate).isAfter(moment(season.endDate))).to.be.true;
    });
});
