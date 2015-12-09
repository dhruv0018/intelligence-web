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

    describe('getCurrentSeason', () => {

        let LeaguesFactory;

        beforeEach(inject([
            'LeaguesFactory',
            function(_LeaugesFactory_) {
                LeaguesFactory = _LeaugesFactory_;
            }
        ]));

        it('should return the current season of the league', function() {
            let currentDate = Date.now();
            let league = {
                id: 1,
                seasons: [
                    {
                        id: 1,
                        startDate: currentDate - 100,
                        endDate: currentDate + 100,
                        leagueId: 1
                    },
                    {
                        id: 2,
                        startDate: currentDate - 200,
                        endDate: currentDate - 100,
                        leagueId: 1
                    },
                    {
                        id: 3,
                        startDate: currentDate - 300,
                        endDate: currentDate - 200,
                        leagueId: 1
                    }
                ]
            }

            LeaguesFactory.extend(league);
            let season = league.getCurrentSeason();
            expect(season).to.be.an('object');
            expect(moment(currentDate).isAfter(moment(season.startDate))).to.be.true;
            expect(moment(currentDate).isBefore(moment(season.endDate))).to.be.true;
        });
    });
});
