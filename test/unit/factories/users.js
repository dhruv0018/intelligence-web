var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

describe('UsersFactory', function() {

    beforeEach(angular.mock.module('intelligence-web-client'));

    it('should exist', inject(function(UsersFactory) {

        expect(UsersFactory).to.exist;
    }));

    it('should have public API', inject(function(UsersFactory) {

    }));

    describe('canPickupGames', function() {

        let UsersFactory;

        beforeEach(angular.mock.module($provide => {

            $provide.service('SessionService', function () {

                this.getCurrentRole = () => { return {indexerQuality: 1}; }
            });
        }));

        beforeEach(inject([
            'UsersFactory',
            function(_UsersFactory_) {

                UsersFactory = _UsersFactory_;

            }
        ]));

        it('should return if an indexer can pick up a game', ()=> {

                expect(UsersFactory.canPickupGames()).to.equal(1);
            });
    });

});
