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

        it('should return false when the video status is not complete', inject([
            'GAME_STATUSES', 'VIDEO_STATUSES', 'GamesFactory',
            function(GAME_STATUSES, VIDEO_STATUSES, games) {
                var game = {
                    status: GAME_STATUSES.READY_FOR_INDEXING.id
                };

                game = games.extend(game);

                [VIDEO_STATUSES.INCOMPLETE.id, VIDEO_STATUSES.UPLOADED.id, VIDEO_STATUSES.FAILED.id].forEach(function(videoStatus) {
                    game.video = {
                        status: videoStatus
                    };

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

                game = games.extend(game);

                game.video = {
                    status: VIDEO_STATUSES.COMPLETE.id
                };

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

                game = games.extend(game);

                [VIDEO_STATUSES.INCOMPLETE.id, VIDEO_STATUSES.UPLOADED.id, VIDEO_STATUSES.FAILED.id].forEach(function(videoStatus) {
                    game.video = {
                        status: videoStatus
                    };

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

                game = games.extend(game);

                game.video = {
                    status: VIDEO_STATUSES.COMPLETE.id
                };

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
            'GAME_STATUSES', 'VIDEO_STATUSES',
            function(GAME_STATUSES, VIDEO_STATUSES) {

                var userId = 1;
                var isQa = false;
                var now = new Date();
                var deadline = now.setMinutes(now.getMinutes() - 1);

                game.video = {
                    status: VIDEO_STATUSES.COMPLETE.id
                };

                game.status = GAME_STATUSES.READY_FOR_INDEXING.id;

                game.assignToIndexer(userId, deadline);

                expect(game.canBeIndexed()).to.be.false;
            }]));

        it('should return true if the deadline has not expired', inject([
            'GAME_STATUSES', 'VIDEO_STATUSES',
            function(GAME_STATUSES, VIDEO_STATUSES) {

                var userId = 1;
                var isQa = false;
                var now = new Date();
                var deadline = now.setMinutes(now.getMinutes() + 1);

                game.video = {
                    status: VIDEO_STATUSES.COMPLETE.id
                };

                game.status = GAME_STATUSES.READY_FOR_INDEXING.id;

                game.assignToIndexer(userId, deadline);

                expect(game.canBeIndexed()).to.be.true;
            }]));

        it('should return false when the game is not in the proper status', inject([
            'GAME_STATUSES', 'VIDEO_STATUSES',
            function(GAME_STATUSES, VIDEO_STATUSES) {

                var userId = 1;
                var isQa = false;
                var now = new Date();
                var deadline = now.setMinutes(now.getMinutes() + 1);

                game.video = {
                    status: VIDEO_STATUSES.COMPLETE.id
                };

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
            'GAME_STATUSES', 'VIDEO_STATUSES',
            function(GAME_STATUSES, VIDEO_STATUSES) {

                var userId = 1;
                var isQa = false;
                var now = new Date();
                var deadline = now.setMinutes(now.getMinutes() + 1);

                game.video = {
                    status: VIDEO_STATUSES.COMPLETE.id
                };

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
            'GAME_STATUSES', 'VIDEO_STATUSES',
            function(GAME_STATUSES, VIDEO_STATUSES) {

                game.video = {
                    status: VIDEO_STATUSES.COMPLETE.id
                };

                var userId = 1;
                var now = new Date();
                var deadline = now.setMinutes(now.getMinutes() - 1);

                game.status = GAME_STATUSES.READY_FOR_QA.id;

                game.assignToQa(userId, deadline);

                expect(game.canBeQAed()).to.be.false;
            }]));

        it('should return true if the deadline has not expired', inject([
            'GAME_STATUSES', 'VIDEO_STATUSES',
            function(GAME_STATUSES, VIDEO_STATUSES) {

                game.video = {
                    status: VIDEO_STATUSES.COMPLETE.id
                };

                var userId = 1;
                var now = new Date();
                var deadline = now.setMinutes(now.getMinutes() + 1);

                game.status = GAME_STATUSES.READY_FOR_QA.id;

                game.assignToQa(userId, deadline);

                expect(game.canBeQAed()).to.be.true;
            }]));

        it('should return false when the game is not in the proper status', inject([
            'GAME_STATUSES', 'VIDEO_STATUSES',
            function(GAME_STATUSES, VIDEO_STATUSES) {

                game.video = {
                    status: VIDEO_STATUSES.COMPLETE.id
                };

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
            'GAME_STATUSES', 'VIDEO_STATUSES',
            function(GAME_STATUSES, VIDEO_STATUSES) {

                game.video = {
                    status: VIDEO_STATUSES.COMPLETE.id
                };

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

                this.get = function(id) {

                    if (id === 1) {

                        const team = {
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
                        };

                        return team;
                    }
                };
            });
        }));

        beforeEach(angular.mock.module($provide => {

            $provide.service('UsersFactory', function () {

                this.get = function(id) {

                    if (id === 1) {

                        const user = {
                            id: 1,
                            firstName: "Test",
                            lastName: "Person",
                            name: "Test Person"
                        };

                        return user;
                    }
                };

                //This method was needed to emulate the creation of a new resource
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
    });

});
