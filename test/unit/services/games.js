var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

describe('GamesFactory', function() {

    beforeEach(angular.mock.module('intelligence-web-client'));

    it('should exist', inject(function(GamesFactory) {

        expect(GamesFactory).to.exist;
    }));

    it('should have public API', inject(function(GamesFactory) {

        expect(GamesFactory).to.respondTo('getStatus');
        expect(GamesFactory).to.respondTo('currentAssignment');
        expect(GamesFactory).to.respondTo('userAssignment');
        expect(GamesFactory).to.respondTo('startAssignment');
        expect(GamesFactory).to.respondTo('isAssignmentStarted');
        expect(GamesFactory).to.respondTo('isAssignmentCompleted');
        expect(GamesFactory).to.respondTo('isAssignedToUser');
        expect(GamesFactory).to.respondTo('isAssignedToIndexer');
        expect(GamesFactory).to.respondTo('isAssignedToQa');
        expect(GamesFactory).to.respondTo('hasAssignment');
        expect(GamesFactory).to.respondTo('hasIndexerAssignment');
        expect(GamesFactory).to.respondTo('hasQaAssignment');
        expect(GamesFactory).to.respondTo('canBeAssignedToIndexer');
        expect(GamesFactory).to.respondTo('canBeAssignedToQa');
        expect(GamesFactory).to.respondTo('assignToIndexer');
        expect(GamesFactory).to.respondTo('assignToQa');
    }));

    describe('canBeAssignedToIndexer', function() {

        it('should return true when the game status is "Indexing, not started"', inject([
           'GAME_STATUSES', 'GamesFactory',
           function(GAME_STATUSES, games) {

            var game = {

                status: GAME_STATUSES.READY_FOR_INDEXING.id
            };

            game = games.extendGame(game);

            game.canBeAssignedToIndexer().should.be.true;
        }]));

        it('should return false when the game status is "Set Aside", but not from indexing', inject([
           'GAME_STATUSES', 'GamesFactory',
           function(GAME_STATUSES, games) {

            var game = {

                status: GAME_STATUSES.SET_ASIDE.id
            };

            game = games.extendGame(game);

            game.canBeAssignedToIndexer().should.be.false;
        }]));

        it('should return true when the game status is "Set Aside", from indexing', inject([
           'GAME_STATUSES', 'GamesFactory',
           function(GAME_STATUSES, games) {

            var game = {

                status: GAME_STATUSES.SET_ASIDE.id,
                indexerAssignments: [
                    {
                        gameId: 1,
                        userId: 1,
                        isQa: false
                    }
                ]
            };

            game = games.extendGame(game);

            game.canBeAssignedToIndexer().should.be.true;
        }]));

        it('should return false for all other game statuses', inject([
           'GAME_STATUSES', 'GamesFactory',
           function(GAME_STATUSES, games) {

            Object.keys(GAME_STATUSES).filter(function(status) {

                return status !== 'READY_FOR_INDEXING' &&
                       status !== 'SET_ASIDE';

            }).forEach(function(status) {

                var game = {

                    status: status
                };

                game = games.extendGame(game);

                game.canBeAssignedToIndexer().should.be.false;
            });
        }]));
    });

    describe('canBeAssignedToQa', function() {

        it('should return true when the game status is "QA, not started"', inject([
           'GAME_STATUSES', 'GamesFactory',
           function(GAME_STATUSES, games) {

            var game = {

                status: GAME_STATUSES.READY_FOR_QA.id
            };

            game = games.extendGame(game);

            game.canBeAssignedToQa().should.be.true;
        }]));

        it('should return false when the game status is "Set Aside", but not from QA', inject([
           'GAME_STATUSES', 'GamesFactory',
           function(GAME_STATUSES, games) {

            var game = {

                status: GAME_STATUSES.SET_ASIDE.id
            };

            game = games.extendGame(game);

            game.canBeAssignedToQa().should.be.false;
        }]));

        it('should return true when the game status is "Set Aside", from QA', inject([
           'GAME_STATUSES', 'GamesFactory',
           function(GAME_STATUSES, games) {

            var game = {

                status: GAME_STATUSES.SET_ASIDE.id,
                indexerAssignments: [
                    {
                        gameId: 1,
                        userId: 1,
                        isQa: true
                    }
                ]
            };

            game = games.extendGame(game);

            game.canBeAssignedToQa().should.be.true;
        }]));

        it('should return false for all other game statuses', inject([
           'GAME_STATUSES', 'GamesFactory',
           function(GAME_STATUSES, games) {

            Object.keys(GAME_STATUSES).filter(function(status) {

                return status !== 'READY_FOR_QA' &&
                       status !== 'SET_ASIDE';

            }).forEach(function(status) {

                var game = {

                    status: status
                };

                game = games.extendGame(game);

                game.canBeAssignedToQa().should.be.false;
            });
        }]));
    });

    describe('assignToIndexer', function() {

        it('should assign indexer when the game status is "Indexing, not started"', inject([
           'GAME_STATUSES', 'GamesFactory',
           function(GAME_STATUSES, games) {

            var userId = 1;
            var isQa = false;

            var game = {

                status: GAME_STATUSES.READY_FOR_INDEXING.id
            };

            game = games.extendGame(game);

            game.assignToIndexer(userId);

            game.indexerAssignments.should.exist;
            game.indexerAssignments.should.not.be.empty;
            expect(game.currentAssignment()).to.have.property('isQa', isQa);
            expect(game.currentAssignment()).to.have.property('userId', userId);
            game.status.should.equal(GAME_STATUSES.READY_FOR_INDEXING.id);
        }]));

        it('should NOT update assignments when the game status is "Set Aside", but not from indexing', inject([
           'GAME_STATUSES', 'GamesFactory',
           function(GAME_STATUSES, games) {

            var userId = 2;

            var game = {

                status: GAME_STATUSES.SET_ASIDE.id
            };

            game = games.extendGame(game);

            expect(function() {
                game.assignToIndexer(userId);
            }).to.throw(Error);

            expect(game.indexerAssignments).to.not.exist;
            expect(game.indexerAssignments).to.be.empty;
            game.status.should.equal(GAME_STATUSES.SET_ASIDE.id);
        }]));

        it('should update assignments when the game status is "Set Aside", from indexing', inject([
           'GAME_STATUSES', 'GamesFactory',
           function(GAME_STATUSES, games) {

            var userId = 2;
            var isQa = false;

            var game = {

                status: GAME_STATUSES.READY_FOR_INDEXING.id
            };

            game = games.extendGame(game);

            game.assignToIndexer(userId);

            game.indexerAssignments.should.exist;
            game.indexerAssignments.should.not.be.empty;
            expect(game.currentAssignment()).to.have.property('isQa', isQa);
            expect(game.currentAssignment()).to.have.property('userId', userId);
            game.status.should.equal(GAME_STATUSES.READY_FOR_INDEXING.id);

            /* Change game status to "Set Aside". */
            game.status = GAME_STATUSES.SET_ASIDE.id;
            game.status.should.equal(GAME_STATUSES.SET_ASIDE.id);

            /* Make another indexer assignment. */
            userId = 3;
            game.assignToIndexer(userId);

            expect(game.currentAssignment()).to.have.property('isQa', isQa);
            expect(game.currentAssignment()).to.have.property('userId', userId);
        }]));
    });

    describe('assignToQa', function() {

        it('should update assignments when the game status is "Qa, not started"', inject([
           'GAME_STATUSES', 'GamesFactory',
           function(GAME_STATUSES, games) {

            var userId = 3;
            var isQa = true;

            var game = {

                status: GAME_STATUSES.READY_FOR_QA.id
            };

            game = games.extendGame(game);

            game.assignToQa(userId);

            game.indexerAssignments.should.exist;
            game.indexerAssignments.should.not.be.empty;
            expect(game.currentAssignment()).to.have.property('isQa', isQa);
            expect(game.currentAssignment()).to.have.property('userId', userId);

            game.status.should.equal(GAME_STATUSES.READY_FOR_QA.id);
        }]));

        it('should NOT update assignments when the game status is "Set Aside", but not from QA', inject([
           'GAME_STATUSES', 'GamesFactory',
           function(GAME_STATUSES, games) {

            var userId = 2;

            var game = {

                status: GAME_STATUSES.SET_ASIDE.id
            };

            game = games.extendGame(game);

            expect(function() {
                game.assignToQa(userId);
            }).to.throw(Error);

            expect(game.indexerAssignments).to.not.exist;
            expect(game.indexerAssignments).to.be.empty;
            game.status.should.equal(GAME_STATUSES.SET_ASIDE.id);
        }]));

        it('should update assignments when the game status is "Set Aside", from QA', inject([
           'GAME_STATUSES', 'GamesFactory',
           function(GAME_STATUSES, games) {

            var userId = 2;
            var isQa = true;

            var game = {

                status: GAME_STATUSES.READY_FOR_QA.id
            };

            game = games.extendGame(game);

            game.assignToQa(userId);

            game.indexerAssignments.should.exist;
            game.indexerAssignments.should.not.be.empty;
            expect(game.currentAssignment()).to.have.property('isQa', isQa);
            expect(game.currentAssignment()).to.have.property('userId', userId);
            game.status.should.equal(GAME_STATUSES.READY_FOR_QA.id);

            /* Change game status to "Set Aside". */
            game.status = GAME_STATUSES.SET_ASIDE.id;
            game.status.should.equal(GAME_STATUSES.SET_ASIDE.id);

            /* Make another QA assignment. */
            userId = 3;
            game.assignToQa(userId);

            expect(game.currentAssignment()).to.have.property('isQa', isQa);
            expect(game.currentAssignment()).to.have.property('userId', userId);
        }]));
    });

    describe('startAssignment', function() {

        it('should start indexer assignment', inject([
           'GAME_STATUSES', 'GamesFactory',
           function(GAME_STATUSES, games) {

            var userId = 1;
            var isQa = false;

            var game = {

                status: GAME_STATUSES.READY_FOR_INDEXING.id
            };

            game = games.extendGame(game);

            game.assignToIndexer(userId);

            /* Simulate server call and insert assignment ID. */
            game.indexerAssignments[0].id = 1;

            game.startAssignment(userId);

            expect(game.currentAssignment()).to.have.property('timeStarted');
            game.status.should.equal(GAME_STATUSES.INDEXING.id);
        }]));

        it('should start QA assignment', inject([
           'GAME_STATUSES', 'GamesFactory',
           function(GAME_STATUSES, games) {

            var userId = 1;
            var isQa = true;

            var game = {

                status: GAME_STATUSES.READY_FOR_QA.id
            };

            game = games.extendGame(game);

            game.assignToQa(userId);

            /* Simulate server call and insert assignment ID. */
            game.indexerAssignments[0].id = 1;

            game.startAssignment(userId);

            expect(game.currentAssignment()).to.have.property('timeStarted');
            game.status.should.equal(GAME_STATUSES.QAING.id);
        }]));
    });
});

