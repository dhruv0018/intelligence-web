var PAGE_SIZE = 20;

var moment = require('moment');

var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.factory('GamesFactory', [
    '$sce', 'GAME_STATUSES', 'GAME_STATUS_IDS', 'GAME_TYPES_IDS', 'GAME_TYPES', 'VIDEO_STATUSES', 'BaseFactory', 'GamesResource', 'GamesStorage', '$q',
    function($sce, GAME_STATUSES, GAME_STATUS_IDS, GAME_TYPES_IDS, GAME_TYPES, VIDEO_STATUSES, BaseFactory, GamesResource, GamesStorage, $q) {

        var GamesFactory = {

            description: 'games',

            storage: GamesStorage,

            resource: GamesResource,

            extend: function(game) {

                var self = this;

                angular.augment(game, self);

                game.notes = game.notes || [];
                game.isDeleted = game.isDeleted || false;

                return game;
            },
            saveNotes: function() {

                var deferred = $q.defer();

                var self = this;
                self.save().then(function() {

                    deferred.notify('saved');

                    GamesResource.get({ id: self.id }, function(result) {
                        self.notes = result.notes;
                        deferred.resolve(result.notes);
                    }, function() {
                        deferred.reject(null);
                    });
                });

                return deferred.promise;
            },

            getStatus: function() {

                var self = this;

                /* Get the game status as a mapped ID. */
                var statusId = GAME_STATUS_IDS[self.status];

                /* Lookup the game status by ID. */
                var status = GAME_STATUSES[statusId];

                return status;
            },

            getRoster: function(teamId) {

                var self = this;

                if (!self.rosters) return undefined;

                return self.rosters[teamId];
            },

            getVideoSources: function() {

                var self = this;

                var sources = [];

                if (self.video && self.video.status) {

                    if (self.video.status === VIDEO_STATUSES.COMPLETE.id) {

                        self.video.videoTranscodeProfiles.forEach(function(profile) {

                            if (profile.status === VIDEO_STATUSES.COMPLETE.id) {

                                var source = {
                                    type: 'video/mp4',
                                    src: $sce.trustAsResourceUrl(profile.videoUrl)
                                };

                                sources.push(source);
                            }
                        });
                    }
                }

                return sources;
            },

            /**
             * Determines if the game can be assigned to an indexer.
             * Indexer assignments follow the these rules:
             *  - If the game status is "Indexing, not started":
             *    1. Then the game can be assigned to an indexer.
             *  - If the game status is "Set aside":
             *    1. The game must have been set aside from indexing.
             *    2. Then the game can be assigned to an indexer.
             * @return true if the game be assigned to an indexer.
             */
            canBeAssignedToIndexer: function() {

                var self = this;

                /* If the game is in the "Indexing, not started" status, it can
                 * be assigned to an indexer. */
                if (self.status == GAME_STATUSES.READY_FOR_INDEXING.id) return true;

                /* Or; if the game is in the "Set Aside" status, and was set
                 * aside from indexing, then it can be assigned to and indexer. */
                else if (self.status == GAME_STATUSES.SET_ASIDE.id && self.setAsideFromIndexing()) return true;

                /* Otherwise; the game can not be assigned to an indexer. */
                else return false;
            },

            /**
             * Determines if the game can be assigned to QA.
             * Indexer assignments follow the these rules:
             *  - If the game status is "QA, not started":
             *    1. Then the game can be assigned to an indexer.
             *  - If the game status is "Set aside":
             *    1. The game must have been set aside from QA.
             *    2. Then the game can be assigned to QA.
             * @return true if the game be assigned to QA.
             */
            canBeAssignedToQa: function() {

                var self = this;

                /* If the game is in the "QA, not started" status, it can
                 * be assigned to QA. */
                if (self.status == GAME_STATUSES.READY_FOR_QA.id) return true;

                /* Or; if the game is in the "Set Aside" status, and was set
                 * aside from QA, then it can be assigned to QA. */
                else if (self.status == GAME_STATUSES.SET_ASIDE.id && self.setAsideFromQa()) return true;

                /* Otherwise; the game can not be assigned to QA. */
                else return false;
            },

            /**
             * Assigns the game to an indexer.
             * The game must first be assignable to an indexer. The assignment
             * is appended to the list of assignments on the game.
             * @param {Integer} userId - the user ID of the user to assign the
             * game to.
             * @param {Date} deadline - date the indexer must complete
             * assignment by
             * @throws {Error} if the game is not assignable to an indexer.
             */
            assignToIndexer: function(userId, deadline) {

                var self = this;

                /* Ensure the game can be assigned. */
                if (self.canBeAssignedToIndexer()) {

                    self.indexerAssignments = self.indexerAssignments || [];

                    deadline = new Date(deadline).toISOString();
                    var timeAssigned = new Date().toISOString();

                    var assignment = {

                        gameId: self.id,
                        userId: userId,
                        isQa: false,
                        deadline: deadline,
                        timeAssigned: timeAssigned
                    };

                    /* Add assignment. */
                    self.indexerAssignments.push(assignment);

                    /* Update game status. */
                    self.status = GAME_STATUSES.READY_FOR_INDEXING.id;
                }

                else {

                    throw new Error('Could not assign game to indexer');
                }
            },

            /**
             * Assigns the game to QA.
             * The game must first be assignable to QA. The assignment
             * is appended to the list of assignments on the game.
             * @param {Integer} userId - the user ID of the user to assign the
             * game to.
             * @param {Date} deadline - date the indexer must complete
             * assignment by
             * @throws {Error} if the game is not assignable to QA.
             */
            assignToQa: function(userId, deadline) {

                var self = this;

                /* Ensure the game can be assigned. */
                if (self.canBeAssignedToQa()) {

                    self.indexerAssignments = self.indexerAssignments || [];

                    deadline = new Date(deadline).toISOString();
                    var timeAssigned = new Date().toISOString();

                    var assignment = {

                        gameId: self.id,
                        userId: userId,
                        isQa: true,
                        deadline: deadline,
                        timeAssigned: timeAssigned
                    };

                    /* Add assignment. */
                    self.indexerAssignments.push(assignment);

                    /* Update game status. */
                    self.status = GAME_STATUSES.READY_FOR_QA.id;
                }

                else {

                    throw new Error('Could not assign game for QA');
                }
            },

            /**
             * Starts an assignment.
             * @param {Integer} userId - the user ID of the user for which the
             * assignment should be started.
             * @param {Object} [assignment] - the assignment to start.
             * Defaults to the games current assignment.
             * @throws {Error} if there is no assignment to start.
             * @throws {Error} on a bad assignment.
             * @throws {Error} if no assignments have been made.
             * @throws {Error} when the assignment has already been started.
             * @throws {Error} when the assignment has already been completed.
             * @throws {Error} if the assignment is not assigned to the user.
             * @throws {Error} if the assignment can not be found.
             */
            startAssignment: function(userId, assignment) {

                var self = this;

                assignment = assignment || self.currentAssignment();

                if (!assignment) throw new Error('No assignment to start');
                if (!assignment.id) throw new Error('Bad assignment');
                if (!self.indexerAssignments) throw new Error('No assignments made');
                if (self.isAssignmentStarted(assignment)) throw new Error('Assignment already started');
                if (self.isAssignmentCompleted(assignment)) throw new Error('Assignment already completed');
                if (!self.isAssignedToUser(userId, assignment)) throw new Error('Assignment not assigned to user');

                /* Find the assignment in the assignments. */
                var index = self.indexerAssignments.map(function(indexerAssignment) {

                    return indexerAssignment.id;

                }).indexOf(assignment.id);

                if (!~index) throw new Error('Assignment not found');

                /* Set the start time of the assignment. */
                assignment.timeStarted = new Date().toISOString();

                self.indexerAssignments[index] = assignment;

                /* Update the game status. */
                self.status = assignment.isQa ? GAME_STATUSES.QAING.id : GAME_STATUSES.INDEXING.id;
            },

            /**
             * Finishes an assignment.
             * @param {Integer} userId - the user ID of the user for which the
             * assignment should be finished.
             * @param {Object} [assignment] - the assignment to finish.
             * Defaults to the games current assignment.
             * @throws {Error} if there is no assignment to finish.
             * @throws {Error} on a bad assignment.
             * @throws {Error} if no assignments have been made.
             * @throws {Error} when the assignment has not been started.
             * @throws {Error} when the assignment has already been finished.
             * @throws {Error} if the assignment is not assigned to the user.
             * @throws {Error} if the assignment can not be found.
             */
            finishAssignment: function(userId, assignment) {

                var self = this;

                assignment = assignment || self.currentAssignment();

                if (!assignment) throw new Error('No assignment to finish');
                if (!assignment.id) throw new Error('Bad assignment');
                if (!self.indexerAssignments) throw new Error('No assignments made');
                if (!self.isAssignmentStarted(assignment)) throw new Error('Assignment not started');
                if (self.isAssignmentCompleted(assignment)) throw new Error('Assignment already finished');
                if (!self.isAssignedToUser(userId, assignment)) throw new Error('Assignment not assigned to user');

                /* Find the assignment in the assignments. */
                var index = self.indexerAssignments.map(function(indexerAssignment) {

                    return indexerAssignment.id;

                }).indexOf(assignment.id);

                if (!~index) throw new Error('Assignment not found');

                /* Set the finish time of the assignment. */
                assignment.timeFinished = new Date().toISOString();

                self.indexerAssignments[index] = assignment;

                /* Update the game status. */
                self.status = assignment.isQa ? GAME_STATUSES.INDEXED.id : GAME_STATUSES.READY_FOR_QA.id;
            },

            currentAssignment: function() {

                if (!this.indexerAssignments) return undefined;

                /* The last assignment in the array is the current one. */
                return this.indexerAssignments.slice(-1).pop();
            },

            userAssignment: function(userId) {

                var self = this;

                var assignments = self.indexerAssignments;

                if (!assignments) return undefined;

                /* Find the users assignment in the assignments. */
                var index = assignments.map(function(assignment) {

                    return assignment.userId;

                }).indexOf(userId);

                /* Return the assignment if found. */
                return ~index ? assignments[index] : undefined;
            },

            isAssignmentStarted: function(assignment) {

                assignment = assignment || this.currentAssignment();

                if (!assignment) return false;

                return !!assignment.timeStarted;
            },

            isAssignmentCompleted: function(assignment) {

                assignment = assignment || this.currentAssignment();

                if (!assignment) return false;

                return !!assignment.timeFinished;
            },

            isAssignedToUser: function(userId, assignment) {

                assignment = assignment || this.currentAssignment();

                if (!userId) return false;
                if (!assignment) return false;

                return assignment.userId == userId;
            },

            isAssignedToIndexer: function(assignment) {

                assignment = assignment || this.currentAssignment();

                if (!assignment) return false;

                return !assignment.isQa;
            },

            isAssignedToQa: function(assignment) {

                assignment = assignment || this.currentAssignment();

                if (!assignment) return false;

                return assignment.isQa;
            },

            hasIndexerAssignment: function() {

                var self = this;

                var assignments = self.indexerAssignments;

                if (!assignments) return false;

                return assignments.some(function(assignment) {

                    return self.isAssignedToIndexer(assignment);
                });
            },

            hasQaAssignment: function() {

                var self = this;

                var assignments = self.indexerAssignments;

                if (!assignments) return false;

                return assignments.some(function(assignment) {

                    return self.isAssignedToQa(assignment);
                });
            },

            hasAssignment: function() {

                return this.hasIndexerAssignment() || this.hasQaAssignment();
            },

            assignmentTimeRemaining: function(assignment) {

                var remaining = 'None';

                assignment = assignment || this.currentAssignment();

                if (!assignment) return remaining;

                var deadline = moment.utc(assignment.deadline);

                if (deadline.isAfter()) {

                    remaining = deadline.fromNow(true);
                }

                return remaining;
            },

            setAsideFromIndexing: function() {

                var self = this;

                /* If the game was not set aside, return false. */
                if (self.status != GAME_STATUSES.SET_ASIDE.id) return false;

                /* Return true if the game was assigned to an indexer. */
                return self.isAssignedToIndexer(self.currentAssignment()) ? true : false;
            },

            setAsideFromQa: function() {

                var self = this;

                /* If the game was not set aside, return false. */
                if (self.status != GAME_STATUSES.SET_ASIDE.id) return false;

                /* Return true if the game was assigned to QA. */
                return self.isAssignedToQa(self.currentAssignment()) ? true : false;
            },

            deadlinePassed: function() {
                var self = this;
                var assignment = self.currentAssignment();

                if (!assignment) return true;

                var deadline = moment.utc(assignment.deadline);

                /* Ensure the current assignments deadline has not expired. */

                if (deadline.isBefore()) return true;

                return false;
            },

            canBeIndexed: function() {

                var self = this;

                if (self.deadlinePassed()) {
                    return false;
                }

                switch (self.status) {
                    case GAME_STATUSES.INDEXING.id:
                    case GAME_STATUSES.READY_FOR_INDEXING.id:
                        return true;
                }

                return false;
            },

            canBeQAed: function() {
                var self = this;

                if (self.deadlinePassed()) {
                    return false;
                }

                switch (self.status) {
                    case GAME_STATUSES.QAING.id:
                    case GAME_STATUSES.READY_FOR_QA.id:
                        return true;
                }

                return false;
            },

            findNoteContentByType: function(notes, noteTypeId) {

                for (var index = 0; index < notes.length; index++) {
                    if (notes[index].noteTypeId === noteTypeId) {
                        return notes[index].content;
                    }
                }
                //no note existed with the desired note type id
                //returning blank content
                return '';
            },
            transformIndexed: function(games) {
                var indexedGames = {};
                var self = this;

                games.forEach(function(game) {

                    game = self.extendGame(game);

                    indexedGames[game.id] = game;
                });

                return indexedGames;
            },
            unadjustTime: function(game) {
                var datePlayed = new Date(game.datePlayed);

                //un-adjusting the time
                datePlayed.setTime(datePlayed.getTime() + datePlayed.getTimezoneOffset() * 60000);
                game.datePlayed = datePlayed;

                return game;
            },
            isRegular: function(game) {
                return GAME_TYPES[GAME_TYPES_IDS[game.gameType]].type === 'regular';
            },

            getFormationReport: function() {
                var self = this;
                return self.resource.getFormationReport({id: self.id});
            },

            getDownAndDistanceReport: function(report) {
                var Resource = this.resource;

                var dndReport = new Resource(report);

                return $q.when(dndReport.$generateDownAndDistanceReport({id: report.gameId}));
            },
            setAside: function() {
                var self = this;
                self.status = GAME_STATUSES.SET_ASIDE.id;
                return self.save();
            }
        };

        angular.augment(GamesFactory, BaseFactory);

        return GamesFactory;
    }
]);

