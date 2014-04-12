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
            var deadline = new Date().toISOString();

            var game = {

                status: GAME_STATUSES.READY_FOR_INDEXING.id
            };

            game = games.extendGame(game);

            game.assignToIndexer(userId, deadline);

            game.indexerAssignments.should.exist;
            game.indexerAssignments.should.not.be.empty;
            expect(game.currentAssignment()).to.have.property('isQa', isQa);
            expect(game.currentAssignment()).to.have.property('userId', userId);
            expect(game.currentAssignment()).to.have.property('deadline', deadline);
            game.status.should.equal(GAME_STATUSES.READY_FOR_INDEXING.id);
        }]));

        it('should NOT update assignments when the game status is "Set Aside", but not from indexing', inject([
           'GAME_STATUSES', 'GamesFactory',
           function(GAME_STATUSES, games) {

            var userId = 2;
            var deadline = new Date().toISOString();

            var game = {

                status: GAME_STATUSES.SET_ASIDE.id
            };

            game = games.extendGame(game);

            expect(function() {
                game.assignToIndexer(userId, deadline);
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
            var deadline = new Date().toISOString();

            var game = {

                status: GAME_STATUSES.READY_FOR_INDEXING.id
            };

            game = games.extendGame(game);

            game.assignToIndexer(userId, deadline);

            game.indexerAssignments.should.exist;
            game.indexerAssignments.should.not.be.empty;
            expect(game.currentAssignment()).to.have.property('isQa', isQa);
            expect(game.currentAssignment()).to.have.property('userId', userId);
            expect(game.currentAssignment()).to.have.property('deadline', deadline);
            game.status.should.equal(GAME_STATUSES.READY_FOR_INDEXING.id);

            /* Change game status to "Set Aside". */
            game.status = GAME_STATUSES.SET_ASIDE.id;
            game.status.should.equal(GAME_STATUSES.SET_ASIDE.id);

            /* Make another indexer assignment. */
            userId = 3;
            game.assignToIndexer(userId, deadline);

            expect(game.currentAssignment()).to.have.property('isQa', isQa);
            expect(game.currentAssignment()).to.have.property('userId', userId);
            expect(game.currentAssignment()).to.have.property('deadline', deadline);
        }]));
    });

    describe('assignToQa', function() {

        it('should update assignments when the game status is "Qa, not started"', inject([
           'GAME_STATUSES', 'GamesFactory',
           function(GAME_STATUSES, games) {

            var userId = 3;
            var isQa = true;
            var deadline = new Date().toISOString();

            var game = {

                status: GAME_STATUSES.READY_FOR_QA.id
            };

            game = games.extendGame(game);

            game.assignToQa(userId, deadline);

            game.indexerAssignments.should.exist;
            game.indexerAssignments.should.not.be.empty;
            expect(game.currentAssignment()).to.have.property('isQa', isQa);
            expect(game.currentAssignment()).to.have.property('userId', userId);
            expect(game.currentAssignment()).to.have.property('deadline', deadline);

            game.status.should.equal(GAME_STATUSES.READY_FOR_QA.id);
        }]));

        it('should NOT update assignments when the game status is "Set Aside", but not from QA', inject([
           'GAME_STATUSES', 'GamesFactory',
           function(GAME_STATUSES, games) {

            var userId = 2;
            var deadline = new Date().toISOString();

            var game = {

                status: GAME_STATUSES.SET_ASIDE.id
            };

            game = games.extendGame(game);

            expect(function() {
                game.assignToQa(userId, deadline);
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
            var deadline = new Date().toISOString();

            var game = {

                status: GAME_STATUSES.READY_FOR_QA.id
            };

            game = games.extendGame(game);

            game.assignToQa(userId, deadline);

            game.indexerAssignments.should.exist;
            game.indexerAssignments.should.not.be.empty;
            expect(game.currentAssignment()).to.have.property('isQa', isQa);
            expect(game.currentAssignment()).to.have.property('userId', userId);
            expect(game.currentAssignment()).to.have.property('deadline', deadline);
            game.status.should.equal(GAME_STATUSES.READY_FOR_QA.id);

            /* Change game status to "Set Aside". */
            game.status = GAME_STATUSES.SET_ASIDE.id;
            game.status.should.equal(GAME_STATUSES.SET_ASIDE.id);

            /* Make another QA assignment. */
            userId = 3;
            game.assignToQa(userId, deadline);

            expect(game.currentAssignment()).to.have.property('isQa', isQa);
            expect(game.currentAssignment()).to.have.property('userId', userId);
            expect(game.currentAssignment()).to.have.property('deadline', deadline);
        }]));
    });

    describe('startAssignment', function() {

        it('should start indexer assignment', inject([
           'GAME_STATUSES', 'GamesFactory',
           function(GAME_STATUSES, games) {

            var userId = 1;
            var isQa = false;
            var deadline = new Date().toISOString();

            var game = {

                status: GAME_STATUSES.READY_FOR_INDEXING.id
            };

            game = games.extendGame(game);

            game.assignToIndexer(userId, deadline);

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
            var deadline = new Date().toISOString();

            var game = {

                status: GAME_STATUSES.READY_FOR_QA.id
            };

            game = games.extendGame(game);

            game.assignToQa(userId, deadline);

            /* Simulate server call and insert assignment ID. */
            game.indexerAssignments[0].id = 1;

            game.startAssignment(userId);

            expect(game.currentAssignment()).to.have.property('timeStarted');
            game.status.should.equal(GAME_STATUSES.QAING.id);
        }]));
    });

    describe('isAssignmentStarted', function() {

        var game;

        var userId = 1;

        beforeEach(inject([
           'GAME_STATUSES', 'GamesFactory',
           function(GAME_STATUSES, games) {

                game = {

                    status: GAME_STATUSES.READY_FOR_INDEXING.id
                };

                game = games.extendGame(game);

                game.assignToIndexer(userId);

                /* Simulate server call and insert assignment ID. */
                game.indexerAssignments[0].id = 1;
            }
        ]));

        it('should return false if no indexer assignments are started', inject([
           function() {

            expect(game.currentAssignment()).to.not.have.property('timeStarted');

            game.isAssignmentStarted().should.be.false;
        }]));

        it('should return true if an indexer assignment is started', inject([
           function() {

            game.startAssignment(userId);

            expect(game.currentAssignment()).to.have.property('timeStarted');

            game.isAssignmentStarted().should.be.true;
        }]));
    });

    describe('finishAssignment', function() {

        it('should finish indexer assignment', inject([
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
            game.finishAssignment(userId);

            expect(game.currentAssignment()).to.have.property('timeFinished');
            game.status.should.equal(GAME_STATUSES.READY_FOR_QA.id);
        }]));

        it('should finish QA assignment', inject([
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
            game.finishAssignment(userId);

            expect(game.currentAssignment()).to.have.property('timeFinished');
            game.status.should.equal(GAME_STATUSES.INDEXED.id);
        }]));
    });

    describe('canBeIndexed', function() {

        var game;

        beforeEach(inject([
           'GAME_STATUSES', 'GamesFactory',
           function(GAME_STATUSES, games) {

                game = {};

                game = games.extendGame(game);
            }
        ]));

        it('should return false if no indexer assignments exist', inject([
           function() {

            expect(game.canBeIndexed()).to.be.false;
        }]));

        it('should return false if the deadline has expired', inject([
            'GAME_STATUSES',
           function(GAME_STATUSES) {

            var userId = 1;
            var isQa = false;
            var now = new Date();
            var deadline = now.setMinutes(now.getMinutes() - 1);

            game.status = GAME_STATUSES.READY_FOR_INDEXING.id;

            game.assignToIndexer(userId, deadline);

            expect(game.canBeIndexed()).to.be.false;
        }]));

        it('should return true if the deadline has not expired', inject([
            'GAME_STATUSES',
           function(GAME_STATUSES) {

            var userId = 1;
            var isQa = false;
            var now = new Date();
            var deadline = now.setMinutes(now.getMinutes() + 1);

            game.status = GAME_STATUSES.READY_FOR_INDEXING.id;

            game.assignToIndexer(userId, deadline);

            expect(game.canBeIndexed()).to.be.true;
        }]));

        it('should return false when the game is not in the proper status', inject([
            'GAME_STATUSES',
           function(GAME_STATUSES) {

            var userId = 1;
            var isQa = false;
            var now = new Date();
            var deadline = now.setMinutes(now.getMinutes() + 1);

            game.status = GAME_STATUSES.READY_FOR_INDEXING.id;

            game.assignToIndexer(userId, deadline);

           [GAME_STATUSES.NOT_INDEXED.id,
            GAME_STATUSES.SET_ASIDE.id,
            GAME_STATUSES.INDEXED.id]
            .forEach(function(status) {

                game.status = status;
                expect(game.canBeIndexed()).to.be.false;
            });
        }]));

        it('should return true when the game is in the proper status', inject([
            'GAME_STATUSES',
           function(GAME_STATUSES) {

            var userId = 1;
            var isQa = false;
            var now = new Date();
            var deadline = now.setMinutes(now.getMinutes() + 1);

            game.status = GAME_STATUSES.READY_FOR_INDEXING.id;

            game.assignToIndexer(userId, deadline);

           [GAME_STATUSES.READY_FOR_INDEXING.id,
            GAME_STATUSES.READY_FOR_INDEXING.id,
            GAME_STATUSES.INDEXING.id,
            GAME_STATUSES.READY_FOR_QA.id,
            GAME_STATUSES.QAING.id]
            .forEach(function(status) {

                game.status = status;
                expect(game.canBeIndexed()).to.be.true;
            });
        }]));
    });
});

