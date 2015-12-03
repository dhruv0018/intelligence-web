var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

var moment = require('moment');

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
        expect(GamesFactory).to.respondTo('getFlagsUrl');
    }));

    describe('getFlagsUrl', () => {

        let gameJSON;
        let game;

        beforeEach(inject([
            'GamesFactory',
            games => {

                gameJSON = {
                    id: 1234
                };

                game = games.extend(gameJSON);
            }
        ]));

        it('should return a string', () => {

            expect(game.getFlagsUrl()).to.be.a('string');
        });

        it('should return the correct URL', inject([
            'config',
            config => {

                game.getFlagsUrl().endsWith(`flags?id=1234`).should.be.true;
        }]));
    });

    describe('canBeAssignedToIndexer', function() {

        it('should return false when the video status is not complete', inject([
            'GAME_STATUSES', 'VIDEO_STATUSES', 'GamesFactory',
            function(GAME_STATUSES, VIDEO_STATUSES, games) {
                var game = {
                    status: GAME_STATUSES.READY_FOR_INDEXING.id
                };

                [VIDEO_STATUSES.INCOMPLETE.id, VIDEO_STATUSES.UPLOADED.id, VIDEO_STATUSES.FAILED.id].forEach(function(videoStatus) {
                    game.video = {
                        status: videoStatus
                    };

                    game = games.extend(game);

                    game.canBeAssignedToIndexer().should.be.false;
                });

            }
        ]));

        it('should return true when the video status is complete', inject([
            'GAME_STATUSES', 'VIDEO_STATUSES', 'GamesFactory',
            function(GAME_STATUSES, VIDEO_STATUSES, games) {
                var game = {
                    status: GAME_STATUSES.READY_FOR_INDEXING.id
                };

                game.video = {
                    status: VIDEO_STATUSES.COMPLETE.id
                };

                game = games.extend(game);

                game.canBeAssignedToIndexer().should.be.true;

            }
        ]));


        it('should return true when the game status is "Indexing, not started"', inject([
            'GAME_STATUSES', 'VIDEO_STATUSES', 'GamesFactory',
            function(GAME_STATUSES, VIDEO_STATUSES, games) {

                var game = {

                    status: GAME_STATUSES.READY_FOR_INDEXING.id,
                    video: {
                        status: VIDEO_STATUSES.COMPLETE.id
                    }
                };

                game = games.extend(game);

                game.canBeAssignedToIndexer().should.be.true;
            }
        ]));

        it('should return false when the game status is "Set Aside", but not from indexing', inject([
            'GAME_STATUSES', 'VIDEO_STATUSES', 'GamesFactory',
            function(GAME_STATUSES, VIDEO_STATUSES, games) {

            var game = {

                status: GAME_STATUSES.SET_ASIDE.id,
                video: {
                    status: VIDEO_STATUSES.COMPLETE.id
                }
            };

            game = games.extend(game);

            game.canBeAssignedToIndexer().should.be.false;
        }]));

        it('should return true when the game status is "Set Aside", from indexing', inject([
            'GAME_STATUSES', 'VIDEO_STATUSES', 'GamesFactory',
            function(GAME_STATUSES, VIDEO_STATUSES, games) {

            var game = {

                status: GAME_STATUSES.SET_ASIDE.id,
                video: {
                    status: VIDEO_STATUSES.COMPLETE.id
                },
                indexerAssignments: [
                    {
                        gameId: 1,
                        userId: 1,
                        isQa: false
                    }
                ]
            };

            game = games.extend(game);

            game.canBeAssignedToIndexer().should.be.true;
        }]));

        it('should return false for all other game statuses', inject([
            'GAME_STATUSES', 'VIDEO_STATUSES', 'GamesFactory',
            function(GAME_STATUSES, VIDEO_STATUSES, games) {

            Object.keys(GAME_STATUSES).filter(function(status) {

                return status !== 'READY_FOR_INDEXING' &&
                    status !== 'SET_ASIDE';

            }).forEach(function(status) {

                var game = {

                    status: status,
                    video: {
                        status: VIDEO_STATUSES.COMPLETE.id
                    }
                };

                game = games.extend(game);

                game.canBeAssignedToIndexer().should.be.false;
            });
        }]));
    });

    describe('canBeAssignedToQa', function() {

        it('should return false when the video status is not complete', inject([
            'GAME_STATUSES', 'VIDEO_STATUSES', 'GamesFactory',
            function(GAME_STATUSES, VIDEO_STATUSES, games) {
                var game = {
                    status: GAME_STATUSES.READY_FOR_QA.id
                };

                [VIDEO_STATUSES.INCOMPLETE.id, VIDEO_STATUSES.UPLOADED.id, VIDEO_STATUSES.FAILED.id].forEach(function(videoStatus) {
                    game.video = {
                        status: videoStatus
                    };

                    game = games.extend(game);

                    game.canBeAssignedToQa().should.be.false;
                });

            }
        ]));

        it('should return true when the video status is complete', inject([
            'GAME_STATUSES', 'VIDEO_STATUSES', 'GamesFactory',
            function(GAME_STATUSES, VIDEO_STATUSES, games) {
                var game = {
                    status: GAME_STATUSES.READY_FOR_QA.id
                };

                game.video = {
                    status: VIDEO_STATUSES.COMPLETE.id
                };

                game = games.extend(game);

                game.canBeAssignedToQa().should.be.true;

            }
        ]));

        it('should return true when the game status is "QA, not started"', inject([
            'GAME_STATUSES', 'VIDEO_STATUSES', 'GamesFactory',
            function(GAME_STATUSES, VIDEO_STATUSES, games) {

            var game = {

                status: GAME_STATUSES.READY_FOR_QA.id,
                video: {
                    status: VIDEO_STATUSES.COMPLETE.id
                }
            };

            game = games.extend(game);

            game.canBeAssignedToQa().should.be.true;
        }]));

        it('should return false when the game status is "Set Aside", but not from QA', inject([
            'GAME_STATUSES', 'VIDEO_STATUSES', 'GamesFactory',
            function(GAME_STATUSES, VIDEO_STATUSES, games) {

            var game = {

                status: GAME_STATUSES.SET_ASIDE.id,
                video: {
                    status: VIDEO_STATUSES.COMPLETE.id
                }
            };

            game = games.extend(game);

            game.canBeAssignedToQa().should.be.false;
        }]));

        it('should return true when the game status is "Set Aside", from QA', inject([
            'GAME_STATUSES', 'VIDEO_STATUSES', 'GamesFactory',
            function(GAME_STATUSES, VIDEO_STATUSES, games) {

            var game = {

                status: GAME_STATUSES.SET_ASIDE.id,
                video: {
                    status: VIDEO_STATUSES.COMPLETE.id
                },
                indexerAssignments: [
                    {
                        gameId: 1,
                        userId: 1,
                        isQa: true
                    }
                ]
            };

            game = games.extend(game);

            game.canBeAssignedToQa().should.be.true;
        }]));

        it('should return false for all other game statuses', inject([
            'GAME_STATUSES', 'VIDEO_STATUSES', 'GamesFactory',
            function(GAME_STATUSES, VIDEO_STATUSES, games) {

            Object.keys(GAME_STATUSES).filter(function(status) {

                return status !== 'READY_FOR_QA' &&
                    status !== 'SET_ASIDE';

            }).forEach(function(status) {

                var game = {

                    status: status,
                    video: {
                        status: VIDEO_STATUSES.COMPLETE.id
                    }
                };

                game = games.extend(game);

                game.canBeAssignedToQa().should.be.false;
            });
        }]));
    });

    describe('assignToIndexer', function() {

        it('should assign indexer when the game status is "Indexing, not started"', inject([
            'GAME_STATUSES', 'VIDEO_STATUSES', 'GamesFactory',
            function(GAME_STATUSES, VIDEO_STATUSES, games) {

            var userId = 1;
            var isQa = false;
            var deadline = new Date().toISOString();

            var game = {

                status: GAME_STATUSES.READY_FOR_INDEXING.id,
                video: {
                    status: VIDEO_STATUSES.COMPLETE.id
                }
            };

            game = games.extend(game);

            game.assignToIndexer(userId, deadline);

            game.indexerAssignments.should.exist;
            game.indexerAssignments.should.not.be.empty;
            expect(game.currentAssignment()).to.have.property('isQa', isQa);
            expect(game.currentAssignment()).to.have.property('userId', userId);
            expect(game.currentAssignment()).to.have.property('deadline', deadline);
            game.status.should.equal(GAME_STATUSES.INDEXING.id);
        }]));

        it('should NOT update assignments when the game status is "Set Aside", but not from indexing', inject([
            'GAME_STATUSES', 'VIDEO_STATUSES', 'GamesFactory',
            function(GAME_STATUSES, VIDEO_STATUSES, games) {

            var userId = 2;
            var deadline = new Date().toISOString();

            var game = {

                status: GAME_STATUSES.SET_ASIDE.id,
                video: {
                    status: VIDEO_STATUSES.COMPLETE.id
                }
            };

            game = games.extend(game);

            expect(function() {
                game.assignToIndexer(userId, deadline);
            }).to.throw(Error);

            expect(game.indexerAssignments).to.not.exist;
            expect(game.indexerAssignments).to.be.empty;
            game.status.should.equal(GAME_STATUSES.SET_ASIDE.id);
        }]));

        it('should update assignments when the game status is "Set Aside", from indexing', inject([
            'GAME_STATUSES', 'VIDEO_STATUSES', 'GamesFactory',
            function(GAME_STATUSES, VIDEO_STATUSES, games) {

            var userId = 2;
            var isQa = false;
            var deadline = new Date().toISOString();

            var game = {

                status: GAME_STATUSES.READY_FOR_INDEXING.id,
                video: {
                    status: VIDEO_STATUSES.COMPLETE.id
                }
            };

            game = games.extend(game);

            game.assignToIndexer(userId, deadline);

            game.indexerAssignments.should.exist;
            game.indexerAssignments.should.not.be.empty;
            expect(game.currentAssignment()).to.have.property('isQa', isQa);
            expect(game.currentAssignment()).to.have.property('userId', userId);
            expect(game.currentAssignment()).to.have.property('deadline', deadline);
            game.status.should.equal(GAME_STATUSES.INDEXING.id);

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
            'GAME_STATUSES', 'VIDEO_STATUSES', 'GamesFactory',
            function(GAME_STATUSES, VIDEO_STATUSES, games) {

            var userId = 3;
            var isQa = true;
            var deadline = new Date().toISOString();

            var game = {

                status: GAME_STATUSES.READY_FOR_QA.id,
                video: {
                    status: VIDEO_STATUSES.COMPLETE.id
                }
            };

            game = games.extend(game);

            game.assignToQa(userId, deadline);

            game.indexerAssignments.should.exist;
            game.indexerAssignments.should.not.be.empty;
            expect(game.currentAssignment()).to.have.property('isQa', isQa);
            expect(game.currentAssignment()).to.have.property('userId', userId);
            expect(game.currentAssignment()).to.have.property('deadline', deadline);

            game.status.should.equal(GAME_STATUSES.QAING.id);
        }]));

        it('should NOT update assignments when the game status is "Set Aside", but not from QA', inject([
            'GAME_STATUSES', 'VIDEO_STATUSES', 'GamesFactory',
            function(GAME_STATUSES, VIDEO_STATUSES, games) {

            var userId = 2;
            var deadline = new Date().toISOString();

            var game = {

                status: GAME_STATUSES.SET_ASIDE.id,
                video: {
                    status: VIDEO_STATUSES.COMPLETE.id
                }
            };

            game = games.extend(game);

            expect(function() {
                game.assignToQa(userId, deadline);
            }).to.throw(Error);

            expect(game.indexerAssignments).to.not.exist;
            expect(game.indexerAssignments).to.be.empty;
            game.status.should.equal(GAME_STATUSES.SET_ASIDE.id);
        }]));

        it('should update assignments when the game status is "Set Aside", from QA', inject([
            'GAME_STATUSES', 'VIDEO_STATUSES', 'GamesFactory',
            function(GAME_STATUSES, VIDEO_STATUSES, games) {

            var userId = 2;
            var isQa = true;
            var deadline = new Date().toISOString();

            var game = {

                status: GAME_STATUSES.READY_FOR_QA.id,
                video: {
                    status: VIDEO_STATUSES.COMPLETE.id
                }
            };

            game = games.extend(game);

            game.assignToQa(userId, deadline);

            game.indexerAssignments.should.exist;
            game.indexerAssignments.should.not.be.empty;
            expect(game.currentAssignment()).to.have.property('isQa', isQa);
            expect(game.currentAssignment()).to.have.property('userId', userId);
            expect(game.currentAssignment()).to.have.property('deadline', deadline);
            game.status.should.equal(GAME_STATUSES.QAING.id);

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
            'GAME_STATUSES', 'VIDEO_STATUSES', 'GamesFactory',
            function(GAME_STATUSES, VIDEO_STATUSES, games) {

            var userId = 1;
            var isQa = false;
            var deadline = new Date().toISOString();

            var game = {

                status: GAME_STATUSES.READY_FOR_INDEXING.id,
                video: {
                    status: VIDEO_STATUSES.COMPLETE.id
                }
            };

            game = games.extend(game);

            game.assignToIndexer(userId, deadline);

            /* Simulate server call and insert assignment ID. */
            game.indexerAssignments[0].id = 1;

            game.startAssignment(userId);

            expect(game.currentAssignment()).to.have.property('timeStarted');
            game.status.should.equal(GAME_STATUSES.INDEXING.id);
        }]));

        it('should start QA assignment', inject([
            'GAME_STATUSES', 'VIDEO_STATUSES', 'GamesFactory',
            function(GAME_STATUSES, VIDEO_STATUSES, games) {

            var userId = 1;
            var isQa = true;
            var deadline = new Date().toISOString();

            var game = {

                status: GAME_STATUSES.READY_FOR_QA.id,
                video: {
                    status: VIDEO_STATUSES.COMPLETE.id
                }
            };

            game = games.extend(game);

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
            'GAME_STATUSES', 'VIDEO_STATUSES', 'GamesFactory',
            function(GAME_STATUSES, VIDEO_STATUSES, games) {

                game = {

                    status: GAME_STATUSES.READY_FOR_INDEXING.id,
                    video: {
                        status: VIDEO_STATUSES.COMPLETE.id
                    }
                };

                game = games.extend(game);

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
            'GAME_STATUSES', 'VIDEO_STATUSES', 'GamesFactory',
            function(GAME_STATUSES, VIDEO_STATUSES, games) {

            var userId = 1;
            var isQa = false;

            var game = {

                status: GAME_STATUSES.READY_FOR_INDEXING.id,
                video: {
                    status: VIDEO_STATUSES.COMPLETE.id
                }
            };

            game = games.extend(game);

            game.assignToIndexer(userId);

            /* Simulate server call and insert assignment ID. */
            game.indexerAssignments[0].id = 1;

            game.startAssignment(userId);
            game.finishAssignment(userId);

            expect(game.currentAssignment()).to.have.property('timeFinished');
            game.status.should.equal(GAME_STATUSES.READY_FOR_QA.id);
        }]));

        it('should finish QA assignment', inject([
            'GAME_STATUSES', 'VIDEO_STATUSES', 'GamesFactory',
            function(GAME_STATUSES, VIDEO_STATUSES, games) {

            var userId = 1;
            var isQa = true;

            var game = {

                status: GAME_STATUSES.READY_FOR_QA.id,
                video: {
                    status: VIDEO_STATUSES.COMPLETE.id
                }
            };

            game = games.extend(game);

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

                game = games.extend(game);
            }
        ]));

        it('should return false if no indexer assignments exist', inject([
            function() {

                expect(game.canBeIndexed()).to.be.false;
            }]));

        it('should return false if the deadline has expired', inject([
            'GAME_STATUSES', 'VIDEO_STATUSES', 'GamesFactory',
            function(GAME_STATUSES, VIDEO_STATUSES, games) {

                var userId = 1;
                var isQa = false;
                var now = new Date();
                var deadline = now.setMinutes(now.getMinutes() - 1);

                game.video = {
                    status: VIDEO_STATUSES.COMPLETE.id
                };

                game = games.extend(game);

                game.status = GAME_STATUSES.READY_FOR_INDEXING.id;

                game.assignToIndexer(userId, deadline);

                expect(game.canBeIndexed()).to.be.false;
            }]));

        it('should return true if the deadline has not expired', inject([
            'GAME_STATUSES', 'VIDEO_STATUSES', 'GamesFactory',
            function(GAME_STATUSES, VIDEO_STATUSES, games) {

                var userId = 1;
                var isQa = false;
                var now = new Date();
                var deadline = now.setMinutes(now.getMinutes() + 1);

                game.video = {
                    status: VIDEO_STATUSES.COMPLETE.id
                };

                game = games.extend(game);

                game.status = GAME_STATUSES.READY_FOR_INDEXING.id;

                game.assignToIndexer(userId, deadline);

                expect(game.canBeIndexed()).to.be.true;
            }]));

        it('should return false when the game is not in the proper status', inject([
            'GAME_STATUSES', 'VIDEO_STATUSES', 'GamesFactory',
            function(GAME_STATUSES, VIDEO_STATUSES, games) {

                var userId = 1;
                var isQa = false;
                var now = new Date();
                var deadline = now.setMinutes(now.getMinutes() + 1);

                game.video = {
                    status: VIDEO_STATUSES.COMPLETE.id
                };

                game = games.extend(game);

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
            'GAME_STATUSES', 'VIDEO_STATUSES', 'GamesFactory',
            function(GAME_STATUSES, VIDEO_STATUSES, games) {

                var userId = 1;
                var isQa = false;
                var now = new Date();
                var deadline = now.setMinutes(now.getMinutes() + 1);

                game.video = {
                    status: VIDEO_STATUSES.COMPLETE.id
                };

                game = games.extend(game);

                game.status = GAME_STATUSES.READY_FOR_INDEXING.id;

                game.assignToIndexer(userId, deadline);

                [GAME_STATUSES.READY_FOR_INDEXING.id,
                    GAME_STATUSES.INDEXING.id]
                    .forEach(function(status) {

                        game.status = status;
                        expect(game.canBeIndexed()).to.be.true;
                    });
            }]));
    });

    describe('canBeQAed', function() {

        var game;

        beforeEach(inject([
            'GAME_STATUSES', 'GamesFactory',
            function(GAME_STATUSES, games) {

                game = {};

                game = games.extend(game);
            }
        ]));

        it('should return false if no indexer assignments exist', inject([
            function() {
                expect(game.canBeQAed()).to.be.false;
            }]));

        it('should return false if the deadline has expired', inject([
            'GAME_STATUSES', 'VIDEO_STATUSES', 'GamesFactory',
            function(GAME_STATUSES, VIDEO_STATUSES, games) {

                game.video = {
                    status: VIDEO_STATUSES.COMPLETE.id
                };

                var userId = 1;
                var now = new Date();
                var deadline = now.setMinutes(now.getMinutes() - 1);

                game = games.extend(game);

                game.status = GAME_STATUSES.READY_FOR_QA.id;

                game.assignToQa(userId, deadline);

                expect(game.canBeQAed()).to.be.false;
            }]));

        it('should return true if the deadline has not expired', inject([
            'GAME_STATUSES', 'VIDEO_STATUSES', 'GamesFactory',
            function(GAME_STATUSES, VIDEO_STATUSES, games) {

                game.video = {
                    status: VIDEO_STATUSES.COMPLETE.id
                };

                game = games.extend(game);

                var userId = 1;
                var now = new Date();
                var deadline = now.setMinutes(now.getMinutes() + 1);

                game.status = GAME_STATUSES.READY_FOR_QA.id;

                game.assignToQa(userId, deadline);

                expect(game.canBeQAed()).to.be.true;
            }]));

        it('should return false when the game is not in the proper status', inject([
            'GAME_STATUSES', 'VIDEO_STATUSES', 'GamesFactory',
            function(GAME_STATUSES, VIDEO_STATUSES, games) {

                game.video = {
                    status: VIDEO_STATUSES.COMPLETE.id
                };

                game = games.extend(game);

                var userId = 1;
                var now = new Date();
                var deadline = now.setMinutes(now.getMinutes() + 1);

                game.status = GAME_STATUSES.READY_FOR_QA.id;

                game.assignToQa(userId, deadline);

                [GAME_STATUSES.NOT_INDEXED.id,
                    GAME_STATUSES.READY_FOR_INDEXING.id,
                    GAME_STATUSES.INDEXING.id,
                    GAME_STATUSES.SET_ASIDE.id,
                    GAME_STATUSES.INDEXED.id]
                    .forEach(function(status) {

                        game.status = status;
                        expect(game.canBeQAed()).to.be.false;
                    });
            }]));

        it('should return true when the game is in the proper status', inject([
            'GAME_STATUSES', 'VIDEO_STATUSES', 'GamesFactory',
            function(GAME_STATUSES, VIDEO_STATUSES, games) {

                game.video = {
                    status: VIDEO_STATUSES.COMPLETE.id
                };

                game = games.extend(game);

                var userId = 1;
                var now = new Date();
                var deadline = now.setMinutes(now.getMinutes() + 1);

                game.status = GAME_STATUSES.READY_FOR_QA.id;

                game.assignToQa(userId, deadline);

                [GAME_STATUSES.READY_FOR_QA.id,
                    GAME_STATUSES.QAING.id]
                    .forEach(function(status) {

                        game.status = status;
                        expect(game.canBeQAed()).to.be.true;
                    });
            }]));
    });

    describe('isDelivered', function(){
        var game;

        beforeEach(inject([
            'GAME_STATUSES', 'GamesFactory',
            function(GAME_STATUSES, games) {

                game = {};

                game = games.extend(game);
            }
        ]));

        it('should return false when the game is in the incorrect status', inject([
            'GAME_STATUSES',
            function(GAME_STATUSES) {
                [
                    GAME_STATUSES.READY_FOR_INDEXING.id,
                    GAME_STATUSES.INDEXING.id,
                    GAME_STATUSES.READY_FOR_QA.id,
                    GAME_STATUSES.QAING.id,
                    GAME_STATUSES.SET_ASIDE.id
                ].forEach(function(status) {
                    game.status = status;
                    expect(game.isDelivered()).to.be.false;
                });
            }]));

        it('should return true when the game is in the correct status', inject([
            'GAME_STATUSES',
            function(GAME_STATUSES) {
                [
                    GAME_STATUSES.FINALIZED.id
                ].forEach(function(status) {
                    game.status = status;
                    expect(game.isDelivered()).to.be.true;
                });
            }]));
    });

    describe('isBeingBrokenDown', function() {
        var game;

        beforeEach(inject([
            'GAME_STATUSES', 'GamesFactory',
            function(GAME_STATUSES, games) {

                game = {};

                game = games.extend(game);
            }
        ]));

        it('should return false when the game is in the incorrect status', inject([
            'GAME_STATUSES',
            function(GAME_STATUSES) {
                [
                    GAME_STATUSES.NOT_INDEXED.id,
                    GAME_STATUSES.READY_FOR_INDEXING.id,
                    GAME_STATUSES.FINALIZED.id
                ].forEach(function(status) {
                        game.status = status;
                        expect(game.isBeingBrokenDown()).to.be.false;
                    });
            }]));

        it('should return true when the game is in the correct status', inject([
            'GAME_STATUSES',
            function(GAME_STATUSES) {
                [
                    GAME_STATUSES.INDEXING.id,
                    GAME_STATUSES.READY_FOR_QA.id,
                    GAME_STATUSES.QAING.id,
                    GAME_STATUSES.SET_ASIDE.id,
                    GAME_STATUSES.INDEXED.id
                ].forEach(function(status) {
                        game.status = status;
                        expect(game.isBeingBrokenDown()).to.be.true;
                    });
            }]));
    });

    describe('isRegular', function() {

        var game;

        beforeEach(inject([
            'GamesFactory',
            function(gamesFactory) {
                game = {};
                game = gamesFactory.extend(game);
            }
        ]));

        it('should return true only for a game with a regular game type', inject([
            'GAME_TYPES_IDS', 'GAME_TYPES',
            function(GAME_TYPES_IDS, GAME_TYPES) {
                Object.keys(GAME_TYPES_IDS).forEach(function(gameTypeId) {

                    switch(gameTypeId) {
                        case GAME_TYPES.CONFERENCE.id:
                        case GAME_TYPES.NON_CONFERENCE.id:
                        case GAME_TYPES.PLAYOFF.id:
                            expect(game.isRegular(gameTypeId)).to.be.true;
                            break;
                        default:
                            expect(game.isRegular(gameTypeId)).to.be.false;
                            break;
                    }
                });
            }
        ]));

        it('should return false for a game without a regular game type', inject([
            'GAME_TYPES_IDS', 'GAME_TYPES',
            function(GAME_TYPES_IDS, GAME_TYPES) {
                Object.keys(GAME_TYPES_IDS).forEach(function(gameTypeId) {

                    switch(gameTypeId) {
                        case GAME_TYPES.SCOUTING.id:
                        case GAME_TYPES.SCRIMMAGE.id:
                            expect(game.isRegular(gameTypeId)).to.be.false;
                            break;
                    }
                });
            }
        ]));

        it('should return false for undefined input', function() {
            expect(game.isRegular()).to.be.false;
        });

    });

    describe('isNonRegular', function() {

        var game;

        beforeEach(inject([
            'GamesFactory',
            function(gamesFactory) {
                game = {};
                game = gamesFactory.extend(game);
            }
        ]));

        it('should return true only for a game with a non-regular game type', inject([
            'GAME_TYPES_IDS', 'GAME_TYPES',
            function(GAME_TYPES_IDS, GAME_TYPES) {
                Object.keys(GAME_TYPES_IDS).forEach(function(gameTypeId) {

                    switch(gameTypeId) {
                        case GAME_TYPES.SCOUTING.id:
                        case GAME_TYPES.SCRIMMAGE.id:
                            expect(game.isNonRegular(gameTypeId)).to.be.true;
                            break;
                        default:
                            expect(game.isNonRegular(gameTypeId)).to.be.false;
                            break;
                    }
                });
            }
        ]));

        it('should return false for a game with a regular game type', inject([
            'GAME_TYPES_IDS', 'GAME_TYPES',
            function(GAME_TYPES_IDS, GAME_TYPES) {
                Object.keys(GAME_TYPES_IDS).forEach(function(gameTypeId) {

                    switch(gameTypeId) {
                        case GAME_TYPES.CONFERENCE.id:
                        case GAME_TYPES.NON_CONFERENCE.id:
                        case GAME_TYPES.PLAYOFF.id:
                            expect(game.isRegular(gameTypeId)).to.be.false;
                            break;
                    }
                });
            }
        ]));

        it('should return false for undefined input', function() {
            expect(game.isNonRegular()).to.be.false;
        });

    });

    describe('share', function() {
        var game;

        beforeEach(inject([
            'GamesFactory', 'SessionService',
            function(gamesFactory, session) {

                session.currentUser = { id: 2 };

                game = {
                    id: 1,
                    shares: []
                };
                game = gamesFactory.extend(game);
            }
        ]));

        function shareCommonTest(sharedWithUserIds, beforeSharingLength, gameId) {

            var newLength = beforeSharingLength + sharedWithUserIds.length;
            expect(game.shares.length).to.equal(newLength);

            var shareObj;
            sharedWithUserIds.forEach(function(user) {
                shareObj = game.shares.shift();

                expect(user.id).to.equal(shareObj.sharedWithUserId);
                expect(shareObj.createdAt).to.be.an.instanceof(Date);
                expect(shareObj.gameId).to.equal(gameId);
            });
        }

        it('should add shares to game', function() {

            var sharedWithUserIds = [{id: 1},{id: 2},{id: 3},{id: 4},{id: 5}];
            var beforeSharingLength = (game.shares) ? game.shares.length : 0;
            var gameId = game.id;

            sharedWithUserIds.forEach(function(userId){
                game.shareWithUser(userId);
            });

            shareCommonTest(sharedWithUserIds, beforeSharingLength, gameId);
        });

        it('should do nothing with an empty input', function() {
            var sharedWithUserIds = [];
            var beforeSharingLength = (game.shares) ? game.shares.length : 0;
            var gameId = game.id;

            sharedWithUserIds.forEach(function(userId){
                game.shareWithUser(userId);
            });

            shareCommonTest(sharedWithUserIds, beforeSharingLength, gameId);
        });
    });

    describe('sharedBy and isSharedWith', function() {
        var game;

        beforeEach(inject([
            'GamesFactory',
            function(gamesFactory) {
                game = {
                    sharedWithUsers: {
                        1: {
                            userId: 2,
                            sharedWithUserId: 1
                        }
                    }
                };
                game = gamesFactory.extend(game);
            }
        ]));

        it('should return the userId who shared the game to the user, or undefined', function() {
            var user = {id: 1};
            var notaUser = {id: 45};
            expect(game.getShareByUser(user).sharedWithUserId).to.equal(1);
            expect(game.isSharedWithUser(user)).to.be.true;

            expect(game.getShareByUser(notaUser)).to.be.undefined;
            expect(game.isSharedWithUser(notaUser)).to.be.false;
        });

        it('should handle undefined or bad input', function() {
            expect(function() {
                game.getShareByUser()
            }).to.throw(Error);

            expect(game.isSharedWithUser()).to.be.false;

            expect(game.getShareByUserId(2)).to.be.undefined;
            expect(game.isSharedWithUserId(2)).to.be.false;
        });

        it('should throw error if no sharedWithLookupTable', function() {
            var backupSharedWithLookupTable = game.sharedWithUsers;
            var user = {id: 1};

            delete game.sharedWithUsers;

            expect(function() {
                game.getShareByUser(user)
            }).to.throw(Error);

            expect(game.isSharedWithUser(user)).to.be.false;

            game.sharedWithUsers = backupSharedWithLookupTable;
        });
    });

    describe('getName', function() {

        let GamesFactory;

        beforeEach(angular.mock.module($provide => {

            $provide.service('TeamsFactory', function () {

                const team = {
                    "1":{
                        id: 1,
                        roles: [
                            {
                            id: 1,
                            userId: 1,
                            type: 3,
                            teamId: 1,
                            tenureEnd: null
                            }
                        ],
                        getHeadCoachRole: () => { return {userId: 1}; }
                    },
                    "2":{
                        id: 2,
                        roles: [
                            {
                            id: 2,
                            userId: null,
                            type: 3,
                            teamId: 2,
                            tenureEnd: null
                            }
                        ],
                        getHeadCoachRole: () => { return {userId: null}; }
                    }
                };

                this.get = function(id) {

                        return team[id];
                };
            });
        }));

        beforeEach(angular.mock.module($provide => {

            $provide.service('UsersFactory', function () {

                const user = {
                    "1":{
                        id: 1,
                        firstName: "Test",
                        lastName: "Person",
                        name: "Test Person"
                    }
                };

                this.get = function(id) {

                    return user[id];
                };

                /*
                  Another part of the app attempts to call this method when the
                  intelligence-web-client module spins up
                */
                this.create = function() {
                    return true;
                };
            });
        }));

        beforeEach(inject([
            'GamesFactory',
            function(_GamesFactory_) {

                GamesFactory = _GamesFactory_;

            }
        ]));

        it('should return the name of the head coach', ()=> {

                GamesFactory.uploaderTeamId = 1;
                expect(GamesFactory.getHeadCoachName()).to.be.a('string');
                expect(GamesFactory.getHeadCoachName()).to.equal('Test Person');
        });

        it('should throw an errow if no uploader team id', ()=> {

                GamesFactory.uploaderTeamId = null;
                expect(() => GamesFactory.getHeadCoachName()).to.throw(Error);
        });

        it('should throw an errow if team does not exist', ()=> {

                GamesFactory.uploaderTeamId = 3;
                expect(() => GamesFactory.getHeadCoachName()).to.throw(Error);
        });

        it('should throw an errow if user does not exist', ()=> {

                GamesFactory.uploaderTeamId = 2;
                expect(() => GamesFactory.getHeadCoachName()).to.throw(Error);
        });
    });

    describe('getDeadlineToReturnGame', function() {

        let GamesFactory;

        beforeEach(inject([
            'GamesFactory',
            function(_GamesFactory_) {

                GamesFactory = _GamesFactory_;

            }
        ]));

        it('should return the deadline to return a game', ()=> {
                GamesFactory.submittedAt = '2015-09-04T16:02:59+00:00';

                const uploaderTeam = {
                    getMaxTurnaroundTime: () => 48
                };

                expect(GamesFactory.getDeadlineToReturnGame(uploaderTeam)).to.be.a('string');
                expect(GamesFactory.getDeadlineToReturnGame(uploaderTeam)).to.equal('2015-09-06T16:02:59+00:00');
        });

        it('should return zero if no submitted at timestamp', ()=> {
                GamesFactory.submittedAt = null;

                const uploaderTeam = {
                    getMaxTurnaroundTime: () => 48
                };

                expect(GamesFactory.getDeadlineToReturnGame(uploaderTeam)).to.equal(0);
        });

    });

    describe('getBySharedWithUserId', function() {
        it('should return empty if there are no games shared', inject(['GamesFactory',
                                                                        function(GamesFactory) {
            sinon.stub(GamesFactory,'getList').returns([]);
            let games = GamesFactory.getBySharedWithUserId(1);
            assert(GamesFactory.getList.should.have.been.called);
            expect(games).to.be.an('array');
            expect(games).to.be.empty;
        }]));

        it('should return empty if there are no games shared with userId', inject(['GamesFactory',
                                                                                    function(GamesFactory) {
            let game1 = GamesFactory.extend({id:1, shares:[{sharedWithUserId : 1}]});
            let game2 = GamesFactory.extend({id:2, shares:[{sharedWithUserId : 2}]});
            let games = [game1, game2];
            sinon.stub(GamesFactory,'getList').returns(games);
            let sharedGames = GamesFactory.getBySharedWithUserId(3);
            assert(GamesFactory.getList.should.have.been.called);
            expect(sharedGames).to.be.an('array');
            expect(sharedGames).to.be.empty;
        }]));

        it('should return games that are shared with userId', inject(['GamesFactory',
                                                                        function(GamesFactory) {
            let game1 = GamesFactory.extend({id:1, shares:[{sharedWithUserId : 1}]});
            let game2 = GamesFactory.extend({id:2, shares:[{sharedWithUserId : 2}]});
            let games = [game1, game2];
            sinon.stub(GamesFactory,'getList').returns(games);
            let sharedGames = GamesFactory.getBySharedWithUserId(1);
            assert(GamesFactory.getList.should.have.been.called);
            expect(sharedGames).to.be.an('array');
            expect(sharedGames).to.eql([game1]);
        }]));
    });

    describe('getBySharedWithTeamId', function() {
        it('should return empty if there are no games shared', inject(['GamesFactory',
                                                                        function(GamesFactory) {
            sinon.stub(GamesFactory,'getList').returns([]);
            let sharedGames = GamesFactory.getBySharedWithTeamId(1);
            assert(GamesFactory.getList.should.have.been.called);
            expect(sharedGames).to.be.an('array');
            expect(sharedGames).to.be.empty;
        }]));

        it('should return empty if there are no games shared with teamId', inject(['GamesFactory',
                                                                                    function(GamesFactory) {
            let game1 = GamesFactory.extend({id:1, shares:[{sharedWithTeamId : 1}]});
            let game2 = GamesFactory.extend({id:2, shares:[{sharedWithTeamId : 2}]});
            let games = [game1, game2];
            sinon.stub(GamesFactory,'getList').returns(games);
            let sharedGames = GamesFactory.getBySharedWithTeamId(3);
            assert(GamesFactory.getList.should.have.been.called);
            expect(sharedGames).to.be.an('array');
            expect(sharedGames).to.be.empty;
        }]));

        it('should return games that are shared with teamId', inject(['GamesFactory',
                                                                        function(GamesFactory) {
            let game1 = GamesFactory.extend({id:1, shares:[{sharedWithTeamId : 1}]});
            let game2 = GamesFactory.extend({id:2, shares:[{sharedWithTeamId : 2}]});
            let games = [game1, game2];
            sinon.stub(GamesFactory,'getList').returns(games);
            let sharedGames = GamesFactory.getBySharedWithTeamId(1);
            assert(GamesFactory.getList.should.have.been.called);
            expect(sharedGames).to.be.an('array');
            expect(sharedGames).to.eql([game1]);
        }]));
    });

    describe('getByRelatedRole', function() {
        let GamesFactory;
        it('should return games using the set params, for coach', inject(['GamesFactory', 'UsersFactory', 'ROLES', 'SessionService',
                                                                                    function(GamesFactory, UsersFactory, ROLES, session) {
            let userId = 20;
            let teamId = 27;
            let gamesList;
            sinon.stub(session,'getCurrentUserId');
            sinon.stub(session,'getCurrentTeamId');
            sinon.stub(GamesFactory,'getByUploaderRole').withArgs(userId, teamId).returns([{id:1}]);
            sinon.stub(GamesFactory,'getByUploaderTeamId').withArgs(teamId).returns([{id:2}]);
            sinon.stub(GamesFactory,'getBySharedWithTeamId').withArgs(teamId).returns([{id:3}]);
            sinon.stub(GamesFactory,'getBySharedWithUserId').withArgs(userId).returns([{id:3}]);
            let uniqueExpectedGames = [{id:1},{id:2},{id:3}];
            sinon.stub(GamesFactory,'getList').withArgs([1,2,3]).returns(uniqueExpectedGames);
            ROLES.COACH.type.id.forEach(type=>{
                session.currentUser = UsersFactory.extend({ id: 2, roles : [{type}]});
                gamesList = GamesFactory.getByRelatedRole(userId, teamId);
                assert(session.getCurrentUserId.should.have.not.been.called);
                assert(session.getCurrentTeamId.should.have.not.been.called);
                assert(GamesFactory.getByUploaderRole.should.have.been.called);
                assert(GamesFactory.getByUploaderTeamId.should.have.been.called);
                assert(GamesFactory.getBySharedWithTeamId.should.have.been.called);
                assert(GamesFactory.getBySharedWithUserId.should.have.been.called);
                expect(gamesList).to.be.an('array');
                expect(gamesList).to.equal(uniqueExpectedGames);
            })
        }]));

        it('should return games using the session params, for coach', inject(['GamesFactory', 'UsersFactory', 'ROLES', 'SessionService',
                                                                            function(GamesFactory, UsersFactory, ROLES, session) {
            let userId = 20;
            let teamId = 27;
            let gamesList;
            sinon.stub(session,'getCurrentUserId').returns(userId);
            sinon.stub(session,'getCurrentTeamId').returns(teamId);
            sinon.stub(GamesFactory,'getByUploaderRole').withArgs(userId, teamId).returns([{id:1}]);
            sinon.stub(GamesFactory,'getByUploaderTeamId').withArgs(teamId).returns([{id:2}]);
            sinon.stub(GamesFactory,'getBySharedWithTeamId').withArgs(teamId).returns([{id:3}]);
            sinon.stub(GamesFactory,'getBySharedWithUserId').withArgs(userId).returns([{id:3}]);
            let uniqueExpectedGames = [{id:1},{id:2},{id:3}];
            sinon.stub(GamesFactory,'getList').withArgs([1,2,3]).returns(uniqueExpectedGames);
            ROLES.COACH.type.id.forEach(type=>{
                session.currentUser = UsersFactory.extend({ id: userId, roles : [{type}]});
                gamesList = GamesFactory.getByRelatedRole();
                assert(session.getCurrentUserId.should.have.been.called);
                assert(session.getCurrentTeamId.should.have.been.called);
                assert(GamesFactory.getByUploaderRole.should.have.been.called);
                assert(GamesFactory.getByUploaderTeamId.should.have.been.called);
                assert(GamesFactory.getBySharedWithTeamId.should.have.been.called);
                assert(GamesFactory.getBySharedWithUserId.should.have.been.called);
                expect(gamesList).to.be.an('array');
                expect(gamesList).to.equal(uniqueExpectedGames);
            })
        }]));

        it('should return games using the set params, for athlete', inject(['GamesFactory', 'UsersFactory', 'ROLE_TYPE', 'SessionService',
                                                                            function(GamesFactory, UsersFactory, ROLE_TYPE, session) {
            let userId = 20;
            let teamId = 27;
            sinon.stub(session,'getCurrentUserId');
            sinon.stub(session,'getCurrentTeamId');
            sinon.stub(GamesFactory,'getByUploaderUserId').withArgs(userId).returns([{id:1}]);
            sinon.stub(GamesFactory,'getByUploaderTeamId').withArgs(teamId).returns([{id:2}]);
            sinon.stub(GamesFactory,'getBySharedWithUserId').withArgs(userId).returns([{id:2}]);
            let uniqueExpectedGames = [{id:1},{id:2}];
            sinon.stub(GamesFactory,'getList').withArgs([1,2]).returns(uniqueExpectedGames);
            session.currentUser = UsersFactory.extend({ id: userId, roles : [{type : ROLE_TYPE.ATHLETE, teamId}]});
            let gamesList = GamesFactory.getByRelatedRole(userId, teamId);
            assert(session.getCurrentUserId.should.have.not.been.called);
            assert(session.getCurrentTeamId.should.have.not.been.called);
            assert(GamesFactory.getByUploaderUserId.should.have.been.called);
            assert(GamesFactory.getByUploaderTeamId.should.have.been.called);
            expect(gamesList).to.be.an('array');
            expect(gamesList).to.equal(uniqueExpectedGames);
        }]));

        it('should return games using the session, for athlete', inject(['GamesFactory', 'UsersFactory', 'ROLE_TYPE', 'SessionService',
                                                                            function(GamesFactory, UsersFactory, ROLE_TYPE, session) {
            let userId = 20;
            let teamId = 27;
            sinon.stub(session,'getCurrentUserId').returns(userId);
            sinon.stub(session,'getCurrentTeamId').returns(teamId);
            sinon.stub(GamesFactory,'getByUploaderUserId').withArgs(userId).returns([{id:1}]);
            sinon.stub(GamesFactory,'getByUploaderTeamId').withArgs(teamId).returns([{id:2}]);
            sinon.stub(GamesFactory,'getBySharedWithUserId').withArgs(userId).returns([{id:2}]);
            let uniqueExpectedGames = [{id:1},{id:2}];
            sinon.stub(GamesFactory,'getList').withArgs([1,2]).returns(uniqueExpectedGames);
            session.currentUser = UsersFactory.extend({ id: userId, roles : [{type : ROLE_TYPE.ATHLETE, teamId}]});
            let gamesList = GamesFactory.getByRelatedRole();
            assert(session.getCurrentUserId.should.have.been.called);
            assert(session.getCurrentTeamId.should.have.been.called);
            assert(GamesFactory.getByUploaderUserId.should.have.been.called);
            assert(GamesFactory.getByUploaderTeamId.should.have.been.called);
            expect(gamesList).to.be.an('array');
            expect(gamesList).to.equal(uniqueExpectedGames);
        }]));

    });

    describe('shareWithTeam', ()=> {
        it("Should throw error when there is no team", inject(['GamesFactory',
                                                                function(GamesFactory) {
                expect(()=>GamesFactory.shareWithTeam()).to.throw(Error);
        }]));

        it("Should not reshare when its already shared", inject(['GamesFactory',
                                                                function(GamesFactory) {
                let initialShares = [{sharedWithTeamId:1}];
                let game = GamesFactory.extend({id:2, shares:initialShares});
                let initialTeamShares = game.sharedWithTeams;
                sinon.stub(game,'isSharedWithTeam').returns(true);
                game.shareWithTeam({id:1})
                expect(game.shares).to.eql(initialShares);
                expect(game.sharedWithTeams).to.eql(initialTeamShares);
        }]));

        it("Should share with team, without telestration", inject(['GamesFactory', 'SessionService',
                                                                function(GamesFactory, session) {
                session.currentUser = {id: 1};
                let initialShares = [{sharedWithTeamId:2}];
                let game = GamesFactory.extend({id:3, shares:initialShares});
                let initialTeamShares = game.sharedWithTeams;
                let team = {id:4}
                const newShare = {
                        userId: session.currentUser.id,
                        gameId: game.id,
                        sharedWithTeamId: team.id,
                        createdAt: moment.utc().toDate(),
                        isBreakdownShared: false,
                        isTelestrationsShared: false
                    };
                sinon.stub(game,'isSharedWithTeam').returns(false);
                game.shareWithTeam(team);
                assert(game.isSharedWithTeam.should.have.been.called);
                let expectedShares = initialShares;
                expectedShares.push(newShare);
                let expectedTeamShares = initialTeamShares;
                expectedTeamShares[newShare.sharedWithTeamId] = newShare;
                expect(game.shares).to.eql(expectedShares);
                expect(game.sharedWithTeams).to.eql(expectedTeamShares);
        }]));

        it("Should share with team, with telestration", inject(['GamesFactory', 'SessionService',
                                                                                        function(GamesFactory, session) {
                session.currentUser = {id: 1};
                let initialShares = [{sharedWithTeamId:2}];
                let game = GamesFactory.extend({id:3, shares:initialShares});
                let initialTeamShares = game.sharedWithTeams;
                let team = {id:4}
                const newShare = {
                        userId: session.currentUser.id,
                        gameId: game.id,
                        sharedWithTeamId: team.id,
                        createdAt: moment.utc().toDate(),
                        isBreakdownShared: false,
                        isTelestrationsShared: true
                    };
                sinon.stub(game,'isSharedWithTeam').returns(false);
                game.shareWithTeam(team, true);
                assert(game.isSharedWithTeam.should.have.been.called);
                let expectedShares = initialShares;
                expectedShares.push(newShare);
                let expectedTeamShares = initialTeamShares;
                expectedTeamShares[newShare.sharedWithTeamId] = newShare;
                expect(game.shares).to.eql(expectedShares);
                expect(game.sharedWithTeams).to.eql(expectedTeamShares);
        }]));
    });

    describe('stopSharing', ()=> {
        it("Should throw error when there is no share is requested", inject(['GamesFactory',
                                                                function(GamesFactory) {
                expect(()=>GamesFactory.stopSharing()).to.throw(Error);
        }]));

        it("Should exit without failing when there are no sharing on the game", inject(['GamesFactory',
                                                                function(GamesFactory) {
                let game = GamesFactory.extend({id:3, shares:[]});
                let initialUserShares = game.sharedWithUsers;
                let initialTeamShares = game.sharedWithTeams;
                game.stopSharing({id:1});
                expect(game.shares).to.eql([]);
                expect(game.sharedWithUsers).to.eql(initialUserShares);
                expect(game.sharedWithTeams).to.eql(initialTeamShares);
        }]));
        it("Should exit without failing when the sharing is not found", inject(['GamesFactory',
                                                                function(GamesFactory) {
                let game = GamesFactory.extend({id:3, shares:[{sharedWithUserId:1},{sharedWithTeamId:1}]});
                let initialUserShares = game.sharedWithUsers;
                let initialTeamShares = game.sharedWithTeams;
                game.stopSharing({id:1});
                expect(game.shares).to.eql([{sharedWithUserId:1},{sharedWithTeamId:1}]);
                expect(game.sharedWithUsers).to.eql(initialUserShares);
                expect(game.sharedWithTeams).to.eql(initialTeamShares);
        }]));
        it("Should remove the share when the user sharing is found", inject(['GamesFactory',
                                                                function(GamesFactory) {
                let game = GamesFactory.extend({id:3, shares:[{sharedWithUserId:1},{sharedWithTeamId:1}]});
                let initialUserShares = game.sharedWithUsers;
                let initialTeamShares = game.sharedWithTeams;
                game.stopSharing({sharedWithUserId:1});
                expect(game.shares).to.eql([{sharedWithTeamId:1}]);
                expect(game.sharedWithUsers).to.eql({});
                expect(game.sharedWithTeams).to.eql(initialTeamShares);
        }]));
        it("Should remove the share when the team sharing is found", inject(['GamesFactory',
                                                                function(GamesFactory) {
                let game = GamesFactory.extend({id:3, shares:[{sharedWithUserId:1},{sharedWithTeamId:1}]});
                let initialUserShares = game.sharedWithUsers;
                let initialTeamShares = game.sharedWithTeams;
                game.stopSharing({sharedWithTeamId:1});
                expect(game.shares).to.eql([{sharedWithUserId:1}]);
                expect(game.sharedWithUsers).to.eql(initialUserShares);
                expect(game.sharedWithTeams).to.eql({});
        }]));
    });

    describe('getShareByTeam', ()=> {
        it("Should throw error when there is no team to find", inject(['GamesFactory',
                                                                function(GamesFactory) {
                expect(()=>GamesFactory.getShareByTeam()).to.throw(Error);
        }]));

        it("Should return share by team", inject(['GamesFactory',
                                                                function(GamesFactory) {
                let game = GamesFactory.extend({id:2, shares:[{sharedWithTeamId:4}]});
                sinon.stub(game,'getShareByTeamId').returns({sharedWithTeamId:4});
                expect(game.getShareByTeam({id:1})).to.eql({sharedWithTeamId:4});
                assert(game.getShareByTeamId.should.have.been.called);
        }]));
    });

    describe('getShareByCurrentUser', ()=> {
        it("Should return user share when shared with user", inject(['GamesFactory', 'SessionService',
                                                                function(GamesFactory, session) {
                let game = GamesFactory.extend({id:2, shares:[{sharedWithUserId:4}]});
                let user = {id:4};
                sinon.stub(session,'getCurrentUser').returns(user);
                sinon.stub(game,'isSharedWithUser').withArgs(user).returns(true);
                sinon.stub(game,'getShareByUser').withArgs(user).returns({sharedWithUserId:user.id});
                expect(game.getShareByCurrentUser()).to.eql({sharedWithUserId:user.id});
                assert(session.getCurrentUser.should.have.been.called);
                assert(game.isSharedWithUser.should.have.been.called);
                assert(game.getShareByUser.should.have.been.called);
        }]));

        it("Should return team share when user is coach", inject(['GamesFactory', 'UsersFactory', 'SessionService', 'ROLES',
                                                                function(GamesFactory, UsersFactory, session, ROLES) {
                let teamId = 6;
                let game = GamesFactory.extend({id:2, shares:[{sharedWithTeamId:teamId}]});
                let callbackGetUser = sinon.stub(session,'getCurrentUser');
                let callbackIsSharedWithUser = sinon.stub(game,'isSharedWithUser');
                sinon.stub(session,'getCurrentTeamId').returns(teamId);
                sinon.stub(game,'isSharedWithTeamId').withArgs(teamId).returns(true);
                sinon.stub(game,'getShareByTeamId').withArgs(teamId).returns({sharedWithTeamId:teamId});
                ROLES.COACH.type.id.forEach(type=>{
                    let user = UsersFactory.extend({ id: 2, roles : [{type}]});
                    callbackGetUser.returns(user);
                    callbackIsSharedWithUser.withArgs(user).returns(false);
                    expect(game.getShareByCurrentUser()).to.eql({sharedWithTeamId:teamId});
                    assert(session.getCurrentUser.should.have.been.called);
                    assert(game.isSharedWithUser.should.have.been.called);
                    assert(session.getCurrentTeamId.should.have.been.called);
                    assert(game.isSharedWithTeamId.should.have.been.called);
                    assert(game.getShareByTeamId.should.have.been.called);
                });
        }]));

        it("Should return undefined when the game is not shared with current user", inject(['GamesFactory', 'UsersFactory', 'SessionService', 'ROLE_TYPE',
                                                                function(GamesFactory, UsersFactory, session, ROLE_TYPE) {
            let teamId = 6;
            let game = GamesFactory.extend({id:2, shares:[{sharedWithTeamId:teamId}]});
            let user = UsersFactory.extend({ id: 2, roles : [{type : ROLE_TYPE.HEAD_COACH}]});
            sinon.stub(session,'getCurrentUser').returns(user);
            sinon.stub(game,'isSharedWithUser').withArgs(user).returns(false);
            sinon.stub(session,'getCurrentTeamId').returns(teamId);
            sinon.stub(game,'isSharedWithTeamId').withArgs(teamId).returns(false);
            expect(game.getShareByCurrentUser()).to.be.undefined;
            assert(session.getCurrentUser.should.have.been.called);
            assert(game.isSharedWithUser.should.have.been.called);
            assert(session.getCurrentTeamId.should.have.been.called);
            assert(game.isSharedWithTeamId.should.have.been.called);
        }]));
    });

    describe('getShareByTeamId', ()=> {
        it("Should throw error when team sharing are not defined on the game", inject(['GamesFactory',
                                                                function(game) {
                let teamId = 6;
                expect(()=>game.getShareByTeamId(teamId)).to.throw(Error);
        }]));

        it("Should return the share when found", inject(['GamesFactory', function(GamesFactory) {
                let teamId = 6;
                let game = GamesFactory.extend({id:2, shares:[{sharedWithTeamId:teamId}]});
                expect(game.getShareByTeamId(teamId)).to.eql({sharedWithTeamId:teamId});
        }]));

        it("Should return undefined when not found", inject(['GamesFactory', function(GamesFactory) {
            let teamId = 6;
            let game = GamesFactory.extend({id:2, shares:[]});
            expect(game.getShareByTeamId(teamId)).to.be.undefined;
        }]));
    });

    describe('isSharedWithTeam', ()=> {
        it("Should return false when there is no team", inject(['GamesFactory',
                                                                function(game) {
                expect(game.isSharedWithTeam()).to.be.false;
        }]));

        it("Should return false when there is no team shares", inject(['GamesFactory', function(game) {
                let team = {id:6};
                expect(game.isSharedWithTeam(team)).to.be.false;
        }]));

        it("Should return false when it is not shared with the team", inject(['GamesFactory', function(GamesFactory) {
            let team = {id:6};
            let game = GamesFactory.extend({id:2, shares:[{sharedWithTeamId:7}]});
            expect(game.isSharedWithTeam(team)).to.be.false;
        }]));

        it("Should return true when it is shared with the team", inject(['GamesFactory', function(GamesFactory) {
            let team = {id:6};
            let game = GamesFactory.extend({id:2, shares:[{sharedWithTeamId:team.id}]});
            expect(game.isSharedWithTeam(team)).to.be.true;
        }]));
    });

    describe('isSharedWithCurrentUser', ()=> {
        it("Should return false, when user is not a coach and the it is not shared with the user", inject(['GamesFactory', 'UsersFactory', 'SessionService', 'ROLE_TYPE',
                                                                function(GamesFactory, UsersFactory, session, ROLE_TYPE) {
                let user = UsersFactory.extend({id:2, roles:[{type:ROLE_TYPE.ATHLETE}]});
                let game = GamesFactory.extend({id:2, shares:[{sharedWithTeamId:7}]});
                let teamId = 7;
                sinon.stub(session,'getCurrentUser').returns(user);
                sinon.stub(game,'isSharedWithUser').withArgs(user).returns(false);
                sinon.stub(session,'getCurrentTeamId').returns(teamId);
                sinon.stub(game,'isSharedWithTeamId').withArgs(teamId).returns(false);
                expect(game.isSharedWithCurrentUser()).to.be.false;
                assert(session.getCurrentUser.should.have.been.called);
                assert(game.isSharedWithUser.should.have.been.called);
                assert(session.getCurrentTeamId.should.have.not.been.called);
                assert(game.isSharedWithTeamId.should.have.not.been.called);
        }]));

        it("Should return true, when user is not a coach and the it is shared with the user", inject(['GamesFactory', 'UsersFactory', 'SessionService', 'ROLE_TYPE',
                                                                                                    function(GamesFactory, UsersFactory, session, ROLE_TYPE) {
                let user = UsersFactory.extend({id:2, roles:[{type:ROLE_TYPE.ATHLETE}]});
                let game = GamesFactory.extend({id:2, shares:[{sharedWithUserId:2}]});
                let teamId = 7;
                sinon.stub(session,'getCurrentUser').returns(user);
                sinon.stub(game,'isSharedWithUser').withArgs(user).returns(true);
                sinon.stub(session,'getCurrentTeamId').returns(teamId);
                sinon.stub(game,'isSharedWithTeamId').withArgs(teamId).returns(false);
                expect(game.isSharedWithCurrentUser()).to.be.true;
                assert(session.getCurrentUser.should.have.been.called);
                assert(game.isSharedWithUser.should.have.been.called);
                assert(session.getCurrentTeamId.should.have.not.been.called);
                assert(game.isSharedWithTeamId.should.have.not.been.called);
        }]));

        it("Should return false, when user is a coach and the it is not shared with the user and team", inject(['GamesFactory', 'UsersFactory', 'SessionService', 'ROLES',
                                                                                                            function(GamesFactory, UsersFactory, session, ROLES) {
                let game = GamesFactory.extend({id:2, shares:[{sharedWithTeamId:7}]});
                let teamId = 7;
                let callbackGetCurrentUser = sinon.stub(session,'getCurrentUser');
                let callbackIsSharedWithUser = sinon.stub(game,'isSharedWithUser');
                sinon.stub(session,'getCurrentTeamId').returns(teamId);
                sinon.stub(game,'isSharedWithTeamId').withArgs(teamId).returns(false);
                ROLES.COACH.type.id.forEach(type => {
                    let user = UsersFactory.extend({id:2, roles:[{type}]});
                    callbackGetCurrentUser.returns(user);
                    callbackIsSharedWithUser.withArgs(user).returns(false);
                    expect(game.isSharedWithCurrentUser()).to.be.false;
                    assert(session.getCurrentUser.should.have.been.called);
                    assert(game.isSharedWithUser.should.have.been.called);
                    assert(session.getCurrentTeamId.should.have.been.called);
                    assert(game.isSharedWithTeamId.should.have.been.called);
                });
        }]));

        it("Should return true, when user is a coach and the it is shared with the user", inject(['GamesFactory', 'UsersFactory', 'SessionService', 'ROLES',
                                                                                                    function(GamesFactory, UsersFactory, session, ROLES) {
                let game = GamesFactory.extend({id:2, shares:[{sharedWithTeamId:7}]});
                let teamId = 7;
                let callbackGetCurrentUser = sinon.stub(session,'getCurrentUser');
                let callbackIsSharedWithUser = sinon.stub(game,'isSharedWithUser');
                sinon.stub(session,'getCurrentTeamId').returns(teamId);
                sinon.stub(game,'isSharedWithTeamId').withArgs(teamId).returns(false);
                ROLES.COACH.type.id.forEach(type => {
                    let user = UsersFactory.extend({id:2, roles:[{type}]});
                    callbackGetCurrentUser.returns(user);
                    callbackIsSharedWithUser.withArgs(user).returns(true);
                    expect(game.isSharedWithCurrentUser()).to.be.true;
                    assert(session.getCurrentUser.should.have.been.called);
                    assert(game.isSharedWithUser.should.have.been.called);
                    assert(session.getCurrentTeamId.should.have.not.been.called);
                    assert(game.isSharedWithTeamId.should.have.not.been.called);
                });
        }]));

        it("Should return true, when user is a coach and the it is not shared with the user, but shared with team", inject(['GamesFactory', 'UsersFactory', 'SessionService', 'ROLES',
                                                                                                    function(GamesFactory, UsersFactory, session, ROLES) {
                let game = GamesFactory.extend({id:2, shares:[{sharedWithTeamId:7}]});
                let teamId = 7;
                let callbackGetCurrentUser = sinon.stub(session,'getCurrentUser');
                let callbackIsSharedWithUser = sinon.stub(game,'isSharedWithUser');
                sinon.stub(session,'getCurrentTeamId').returns(teamId);
                sinon.stub(game,'isSharedWithTeamId').withArgs(teamId).returns(true);
                ROLES.COACH.type.id.forEach(type => {
                    let user = UsersFactory.extend({id:2, roles:[{type}]});
                    callbackGetCurrentUser.returns(user);
                    callbackIsSharedWithUser.withArgs(user).returns(false);
                    expect(game.isSharedWithCurrentUser()).to.be.true;
                    assert(session.getCurrentUser.should.have.been.called);
                    assert(game.isSharedWithUser.should.have.been.called);
                    assert(session.getCurrentTeamId.should.have.been.called);
                    assert(game.isSharedWithTeamId.should.have.been.called);
                });
        }]));
    });

    describe('isBreakdownSharedWithCurrentUser', ()=> {
        it("Should return false, when the game is not shared with current user", inject(['GamesFactory', function(GamesFactory) {
                sinon.stub(GamesFactory,'isSharedWithCurrentUser').returns(false);
                sinon.stub(GamesFactory,'getShareByCurrentUser');
                expect(GamesFactory.isBreakdownSharedWithCurrentUser()).to.be.false;
                assert(GamesFactory.isSharedWithCurrentUser.should.have.been.called);
                assert(GamesFactory.getShareByCurrentUser.should.have.not.been.called);
        }]));

        it("Should return false, when the game breakdown is not shared with current user", inject(['GamesFactory', function(GamesFactory) {
                sinon.stub(GamesFactory,'isSharedWithCurrentUser').returns(true);
                sinon.stub(GamesFactory,'getShareByCurrentUser').returns({isBreakdownShared:false});
                expect(GamesFactory.isBreakdownSharedWithCurrentUser()).to.be.false;
                assert(GamesFactory.isSharedWithCurrentUser.should.have.been.called);
                assert(GamesFactory.getShareByCurrentUser.should.have.been.called);
        }]));

        it("Should return true, when the game breakdown is shared with current user", inject(['GamesFactory', function(GamesFactory) {
                sinon.stub(GamesFactory,'isSharedWithCurrentUser').returns(true);
                sinon.stub(GamesFactory,'getShareByCurrentUser').returns({isBreakdownShared:true});
                expect(GamesFactory.isBreakdownSharedWithCurrentUser()).to.be.true;
                assert(GamesFactory.isSharedWithCurrentUser.should.have.been.called);
                assert(GamesFactory.getShareByCurrentUser.should.have.been.called);
        }]));
    });

    describe('isSharedWithTeamId', ()=> {
        it("Should return false, when there is no teamId", inject(['GamesFactory', function(GamesFactory) {
                expect(GamesFactory.isSharedWithTeamId()).to.be.false;
        }]));

        it("Should return false, when it is not shared with any team", inject(['GamesFactory', function(GamesFactory) {
                let teamId = 6;
                expect(GamesFactory.isSharedWithTeamId(teamId)).to.be.false;
        }]));

        it("Should return false, when it is not shared with teamId", inject(['GamesFactory', function(GamesFactory) {
                let teamId = 6;
                let game = GamesFactory.extend({id:2, shares:[{sharedWithTeamId:7}]});
                sinon.stub(game,'getShareByTeamId').withArgs(teamId).returns(undefined);
                expect(game.isSharedWithTeamId(teamId)).to.be.false;
                assert(game.getShareByTeamId.should.have.been.called);
        }]));

        it("Should return true, when it is shared with teamId", inject(['GamesFactory', function(GamesFactory) {
                let teamId = 6;
                let game = GamesFactory.extend({id:2, shares:[{sharedWithTeamId:6}]});
                sinon.stub(game,'getShareByTeamId').withArgs(teamId).returns({sharedWithTeamId:6});
                expect(game.isSharedWithTeamId(teamId)).to.be.true;
                assert(game.getShareByTeamId.should.have.been.called);
        }]));
    });

    describe('getTeamShares', ()=> {
        it("Should throw error when team shares are not available on the game", inject(['GamesFactory', function(GamesFactory) {
                expect(()=>GamesFactory.getTeamShares()).to.throw(Error);
        }]));

        it("Should get the team shares", inject(['GamesFactory', function(GamesFactory) {
                let game = GamesFactory.extend({id:2, shares:[{sharedWithTeamId:7}]});
                expect(game.getTeamShares()).to.eql([{sharedWithTeamId:7}]);
        }]));
    });

    describe('getNonPublicShares', ()=> {
        it("Should return only non public shares", inject(['GamesFactory', function(GamesFactory) {
                let game = GamesFactory.extend({id:2, shares:[{id:1, sharedWithTeamId:6}, {id:2, sharedWithUserId:7}, {id:3}]});
                expect(game.getNonPublicShares()).to.eql([{id:1, sharedWithTeamId:6}, {id:2, sharedWithUserId:7}]);
        }]));
    });

    describe('isPublicShare', ()=> {
        it("Should return false when if the share is not non public", inject(['GamesFactory', function(GamesFactory) {
                let game = GamesFactory.extend({id:2, shares:[{id:1, sharedWithTeamId:6}, {id:2, sharedWithUserId:7}, {id:3}]});
                expect(game.isPublicShare({id:1, sharedWithTeamId:6})).to.be.false;
        }]));

        it("Should return true when the share is public", inject(['GamesFactory', function(GamesFactory) {
                let game = GamesFactory.extend({id:2, shares:[{id:1, sharedWithTeamId:6}, {id:2, sharedWithUserId:7}, {id:3}]});
                expect(game.isPublicShare(game.publicShare)).to.be.true;
        }]));
    });

    describe('isFeatureSharedWithTeam', ()=> {
        it("Should throw error is the feature attribute is missing", inject(['GamesFactory', function(GamesFactory) {
                expect(()=>GamesFactory.isFeatureSharedWithTeam()).to.throw(Error);
        }]));

        it("Should throw error if the feature is invalid attribute", inject(['GamesFactory', function(GamesFactory) {
                let game = GamesFactory.extend({id:2, shares:[{id:1, sharedWithTeamId:6}, {id:2, sharedWithUserId:7}, {id:3}]});
                expect(()=>GamesFactory.isFeatureSharedWithTeam(1)).to.throw(Error);
        }]));

        it("Should return false when the game is not shared with the team", inject(['GamesFactory', function(GamesFactory) {
            let game = GamesFactory.extend({id:2, shares:[{id:1, sharedWithTeamId:6}, {id:2, sharedWithUserId:7}, {id:3}]});
            let team = {id:6};
            sinon.stub(game,'getShareByTeam').withArgs(team).returns(undefined);
            expect(game.isFeatureSharedWithTeam('feature1', team)).to.be.false;
            assert(game.getShareByTeam.should.have.been.called);
        }]));

        it("Should return false when the game is shared, but the feature is not available", inject(['GamesFactory', function(GamesFactory) {
            let game = GamesFactory.extend({id:2, shares:[{id:1, sharedWithTeamId:6}, {id:2, sharedWithUserId:7}, {id:3}]});
            let team = {id:6};
            sinon.stub(game,'getShareByTeam').withArgs(team).returns({id:1, sharedWithTeamId:6});
            expect(game.isFeatureSharedWithTeam('feature1', team)).to.be.false;
            assert(game.getShareByTeam.should.have.been.called);
        }]));

        it("Should return false when the game is shared, but the feature is not shared", inject(['GamesFactory', function(GamesFactory) {
            let game = GamesFactory.extend({id:2, shares:[{id:1, sharedWithTeamId:6}, {id:2, sharedWithUserId:7}, {id:3}]});
            let team = {id:6};
            sinon.stub(game,'getShareByTeam').withArgs(team).returns({id:1, sharedWithTeamId:6, 'feature1':false});
            expect(game.isFeatureSharedWithTeam('feature1', team)).to.be.false;
            assert(game.getShareByTeam.should.have.been.called);
        }]));

        it("Should return true when the game is shared with the feature", inject(['GamesFactory', function(GamesFactory) {
            let game = GamesFactory.extend({id:2, shares:[{id:1, sharedWithTeamId:6}, {id:2, sharedWithUserId:7}, {id:3}]});
            let team = {id:6};
            sinon.stub(game,'getShareByTeam').withArgs(team).returns({id:1, sharedWithTeamId:6, 'feature1':true});
            expect(game.isFeatureSharedWithTeam('feature1', team)).to.be.true;
            assert(game.getShareByTeam.should.have.been.called);
        }]));
    });

    describe('isTelestrationsSharedWithTeam', ()=> {
        it("Should return true when shared", inject(['GamesFactory', function(GamesFactory) {
                let user = {id:9};
                sinon.stub(GamesFactory,'isFeatureSharedWithTeam').withArgs('isTelestrationsShared',user).returns(true);
                expect(GamesFactory.isTelestrationsSharedWithTeam(user)).to.be.true;
                assert(GamesFactory.isFeatureSharedWithTeam.should.have.been.called);
        }]));

        it("Should return false when not shared", inject(['GamesFactory', function(GamesFactory) {
                let user = {id:9};
                sinon.stub(GamesFactory,'isFeatureSharedWithTeam').withArgs('isTelestrationsShared',user).returns(false);
                expect(GamesFactory.isTelestrationsSharedWithTeam(user)).to.be.false;
                assert(GamesFactory.isFeatureSharedWithTeam.should.have.been.called);
        }]));
    });

    describe('isAllowedToView', ()=> {

        let GamesFactory;
        let session;
        let teamIds;
        let user;

        beforeEach(inject([
            'GamesFactory', 'UsersFactory', 'SessionService',
            function(_GamesFactory_, UsersFactory, _session_) {
                GamesFactory = _GamesFactory_;
                session = _session_;

                teamIds = [7];
                user = UsersFactory.extend({id:9});
            }
        ]));

        it("Should return false when its not shared publicly, and not shared with user or team, and user doesnt belong to uploader team", ()=> {
                let game = GamesFactory.extend({id:2, uploaderUserId:10, uploaderTeamId:11});
                sinon.stub(game,'isSharedWithPublic').returns(false);
                sinon.stub(session,'getCurrentUser').returns(user);
                sinon.stub(session,'getCurrentUserId').returns(user.id);
                sinon.stub(session,'getCurrentTeamId').returns(teamIds[0]);
                sinon.stub(game,'isSharedWithCurrentUser').returns(false);
                expect(game.isAllowedToView(teamIds, user.id)).to.be.false;
                assert(game.isSharedWithPublic.should.have.been.called);
                assert(game.isSharedWithCurrentUser.should.have.been.called);
        });

        it("Should return true when its shared publicly", ()=> {
                let game = GamesFactory.extend({id:2, uploaderUserId:10, uploaderTeamId:11});
                sinon.stub(game,'isSharedWithPublic').returns(true);
                sinon.stub(session,'getCurrentUser').returns(user);
                sinon.stub(session,'getCurrentUserId').returns(user.id);
                sinon.stub(session,'getCurrentTeamId').returns(teamIds[0]);
                sinon.stub(game,'isSharedWithCurrentUser').returns(false);
                expect(game.isAllowedToView(teamIds, user.id)).to.be.true;
                assert(game.isSharedWithPublic.should.have.been.called);
                assert(game.isSharedWithCurrentUser.should.have.not.been.called);
        });

        it("Should return true when its uploaded by the current user", ()=> {
                let game = GamesFactory.extend({id:2, uploaderUserId:user.id, uploaderTeamId:11});
                sinon.stub(game,'isSharedWithPublic').returns(false);
                sinon.stub(session,'getCurrentUser').returns(user);
                sinon.stub(session,'getCurrentUserId').returns(user.id);
                sinon.stub(session,'getCurrentTeamId').returns(teamIds[0]);
                sinon.stub(game,'isSharedWithCurrentUser').returns(false);
                expect(game.isAllowedToView(teamIds, user.id)).to.be.true;
                assert(game.isSharedWithPublic.should.have.been.called);
                assert(game.isSharedWithCurrentUser.should.have.not.been.called);
        });

        it("Should return true when its uploaded by the current user's team", ()=> {
                let game = GamesFactory.extend({id:2, uploaderUserId:10, uploaderTeamId:teamIds[0]});
                sinon.stub(game,'isSharedWithPublic').returns(false);
                sinon.stub(session,'getCurrentUser').returns(user);
                sinon.stub(session,'getCurrentUserId').returns(user.id);
                sinon.stub(session,'getCurrentTeamId').returns(teamIds[0]);
                sinon.stub(game,'isSharedWithCurrentUser').returns(false);
                expect(game.isAllowedToView(teamIds, user.id)).to.be.true;
                assert(game.isSharedWithPublic.should.have.been.called);
                assert(game.isSharedWithCurrentUser.should.have.not.been.called);
        });

        it("Should return true when its shared with the current user", ()=> {
                let game = GamesFactory.extend({id:2, uploaderUserId:10, uploaderTeamId:11});
                sinon.stub(game,'isSharedWithPublic').returns(false);
                sinon.stub(session,'getCurrentUser').returns(user);
                sinon.stub(session,'getCurrentUserId').returns(user.id);
                sinon.stub(session,'getCurrentTeamId').returns(teamIds[0]);
                sinon.stub(game,'isSharedWithCurrentUser').returns(true);
                expect(game.isAllowedToView(teamIds, user.id)).to.be.true;
                assert(game.isSharedWithPublic.should.have.been.called);
                assert(game.isSharedWithCurrentUser.should.have.been.called);
        });
    });

    describe('isCopied', ()=> {
        it("Should return false, when there is no copiedFromGameId is null", inject(['GamesFactory', function(GamesFactory) {
                let game = GamesFactory.extend({id:1,copiedFromGameId:null});
                expect(game.isCopied()).to.be.false;
        }]));

        it("Should return true, when there copiedFromGameId is not null", inject(['GamesFactory', function(GamesFactory) {
                let game = GamesFactory.extend({id:1,copiedFromGameId:12344});
                expect(game.isCopied()).to.be.true;
        }]));
    });

    describe('getMaxprepsDownloadLinkByTeam', ()=> {
        it("Should frame the maxpreps download link",
            inject(['GamesFactory', 'TokensService', 'config', function(GamesFactory, TokensService, config) {
                let team = {id:10};
                let game = GamesFactory.extend({id:12});
                config.api.uri = 'http://dummyurl/';
                sinon.stub(TokensService,'getAccessToken').returns('dummytoken');
                let expectedUrl = 'http://dummyurl/games/12/max-preps?teamId=10&access_token=dummytoken';
                expect(game.getMaxprepsDownloadLinkByTeam(team)).to.equal(expectedUrl);
                assert(TokensService.getAccessToken.should.have.been.called);
        }]));
    });

    describe('getCSVDownloadLink', ()=> {
        it("Should frame the csv download link",
            inject(['GamesFactory', 'TokensService', 'config', function(GamesFactory, TokensService, config) {
                let game = GamesFactory.extend({id:12});
                config.api.uri = 'http://dummyurl/';
                sinon.stub(TokensService,'getAccessToken').returns('dummytoken');
                let expectedUrl = 'http://dummyurl/games/12/stats-csv?access_token=dummytoken';
                expect(game.getCSVDownloadLink()).to.equal(expectedUrl);
                assert(TokensService.getAccessToken.should.have.been.called);
        }]));
    });

    describe('getAssignmentsByUserId', function() {
        var game;

        beforeEach(inject([
            'GamesFactory',
            function(gamesFactory) {
                game = {
                    indexerAssignments: [
                        {
                            "userId": 1
                        },
                        {
                            "userId": 5
                        },
                    ]
                };
                game = gamesFactory.extend(game);
            }
        ]));

        it("should return the proper number of assignments corresponding to the user id passed in", () => {
            let userId = 1;
            let assignments = game.getAssignmentsByUserId(userId);
            expect(assignments.length).to.equal(1);
        });

        it("should return empty array if no user id passed in", () => {
            let assignments = game.getAssignmentsByUserId();
            expect(assignments.length).to.equal(0);
        });

        it("should return empty array if user id passed in is not found", () => {
            let userId = 100;
            let assignments = game.getAssignmentsByUserId(userId);
            expect(assignments.length).to.equal(0);
        });
    });

    describe("getInactiveAssignmentsByUserId", () => {
        var game;

        beforeEach(inject([
            'GamesFactory',
            function(gamesFactory) {
                game = {
                    indexerAssignments: [
                        {
                            "userId": 1,
                            "timeFinished": "2015-07-08T15:17:59+00:00"
                        },
                        {
                            "userId": 5
                        },
                        {
                            "userId": 1
                        },
                        {
                            "userId": 1,
                            "timeFinished": "2015-07-09T15:17:59+00:00"
                        }
                    ]
                };
                game = gamesFactory.extend(game);
            }
        ]));

        it("should return the proper number of assignments corresponding to the user id passed in", () => {
            let userId = 1;
            let assignments = game.getInactiveAssignmentsByUserId(userId);
            expect(assignments.length).to.equal(2);
        });
    });
});
