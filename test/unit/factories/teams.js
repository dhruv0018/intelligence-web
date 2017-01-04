var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

describe('TeamsFactory', function() {

    beforeEach(angular.mock.module('intelligence-web-client'));

    it('should exist', inject(function(TeamsFactory) {
        expect(TeamsFactory).to.exist;
    }));

    xdescribe('getActivePackage', ()=> {

        let TeamsFactory;

        beforeEach(inject([
            'TeamsFactory',
            function(_TeamsFactory_) {
                TeamsFactory = _TeamsFactory_;
            }
        ]));

        it('should return one package with the higher ID', function() {

            let team = {
                id: 1,
                teamPackages: [
                    {
                        "id": 2288,
                        "maxGamesPerPackage": 5,
                        "maxTurnaroundTime": 48,
                        "startDate": "2014-07-15T04:00:00+00:00",
                        "endDate": "2016-08-13T03:59:59+00:00"
                    },
                    {
                        "id": 2289,
                        "maxGamesPerPackage": 5,
                        "maxTurnaroundTime": 48,
                        "startDate": "2014-07-15T04:00:00+00:00",
                        "endDate": "2016-08-13T03:59:59+00:00"
                    }
                ]
            };


            TeamsFactory.extend(team);

            let teamPackage = team.getActivePackage();

            expect(teamPackage).to.be.an('object');
            expect(teamPackage.id).to.equal(2289);
        });

    });

});
