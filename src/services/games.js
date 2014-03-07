var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('GamesFactory', [
    'GAME_STATUSES', 'GAME_STATUS_IDS', 'GamesResource',
    function(GAME_STATUSES, GAME_STATUS_IDS, GamesResource) {

        var GamesFactory = {

            resource: GamesResource,

            extendGame: function(game) {

                var self = this;

                /* Copy all of the properties from the retrieved $resource
                 * "game" object. */
                angular.extend(game, self);

                return game;
            },

            get: function(id, success, error) {

                var self = this;

                var callback = function(game) {

                    game = self.extendGame(game);

                    return success ? success(game) : game;
                };

                error = error || function() {

                    throw new Error('Could not get game');
                };

                return self.resource.get({ id: id }, callback, error);
            },

            getList: function(filter, success, error, index) {

                var self = this;

                if (angular.isFunction(filter)) {

                    index = error;
                    error = success;
                    success = filter;
                    filter = null;
                }

                filter = filter || {};
                filter.start = filter.start || 0;
                filter.count = filter.count || 1000;

                var callback = function(games) {

                    var indexedGames = {};

                    games.forEach(function(game) {

                        game = self.extendGame(game);

                        indexedGames[game.id] = game;
                    });

                    games = index ? indexedGames : games;

                    return success ? success(games) : games;
                };

                error = error || function() {

                    throw new Error('Could not load games list');
                };

                return self.resource.query(filter, callback, error);
            },

            save: function(game, success, error) {

                var self = this;

                game = game || self;

                parameters = {};

                success = success || function(game) {

                    return self.extendGame(game);
                };

                error = error || function() {

                    throw new Error('Could not save game');
                };

                if (game.id) {

                    var updatedGame = self.resource.update(parameters, game, success, error);
                    return updatedGame.$promise;

                } else {

                    var newGame = self.resource.create(parameters, game, success, error);
                    return newGame.$promise;
                }
            },

            getStatus: function() {

                var self = this;

                /* Get the game status as a mapped ID. */
                var statusId = self.status ? GAME_STATUS_IDS[self.status] : undefined;

                /* Lookup the game status by ID. */
                var status = statusId ? GAME_STATUSES[statusId] : undefined;

                if (!status) return undefined;

                /* If the game is in set aside status. */
                if (status.id === GAME_STATUSES.SET_ASIDE.id && status.name === GAME_STATUSES.SET_ASIDE.name) {

                    /* If the game was assigned to an indexer. */
                    if (self.isAssignedToIndexer(self.currentAssignment())) {

                        status.name += ', from indexing';
                    }

                    /* If the game was assigned to QA. */
                    else if (self.isAssignedToQa(self.currentAssignment())) {

                        status.name += ', from QA';
                    }
                }

                return status;
            },

            getRoster: function(teamId) {

                var self = this;

                if (!self.rosters) return undefined;

                return self.rosters[teamId];
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
                return !!~index ? assignments[index] : undefined;
            },

            startAssignment: function(userId, assignment) {

                var self = this;

                self.indexerAssignments = self.indexerAssignments || [];

                assignment = assignment || self.currentAssignment() || {};

                if (assignment.timeStarted) throw new Error('Assignment already started');
                if (self.isAssignmentCompleted(assignment)) throw new Error('Assignment already completed');
                if (!self.isAssignedToUser(userId, assignment)) throw new Error('Assignment not assigned to user');

                /* Set the start time of the assignment. */
                assignment.timeStarted = new Date(Date.now()).toISOString();

                /* Find the assignment in the assignments. */
                var index = self.indexerAssignments.map(function(indexerAssignment) {

                    return indexerAssignment.id;

                }).indexOf(assignment.id);

                /* If the assignment is in the assignments already, then update;
                 * or if its not already in, then add it to the assignments. */
                if (!!~index) self.indexerAssignments[index] = assignment;
                else self.indexerAssignments.push(assignment);

                /* Update the game status. */
                self.status = assignment.isQa ? GAME_STATUSES.QAING.id : GAME_STATUSES.INDEXING.id;
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

            areIndexerAssignmentsCompleted: function() {

                var assignments = self.indexerAssignments;

                /* If there are no assignments, consider assignments incomplete. */
                if (!assignments) return false;

                return assignments.map(function(assignment) {

                    /* If it is an indexer assignment. */
                    if (self.isAssignedToQa(assignment)) return assignment;

                }).every(function(assignment) {

                    /* Make sure the assignment was completed. */
                    return self.isAssignmentCompleted(assignment);
                });
            },

            areQaAssignmentsCompleted: function() {

                var assignments = self.indexerAssignments;

                /* If there are no assignments, consider assignments incomplete. */
                if (!assignments) return false;

                return assignments.map(function(assignment) {

                    /* If it is a QA assignment. */
                    if (self.isAssignedToQa(assignment)) return assignment;

                }).every(function(assignment) {

                    /* Make sure the assignment was completed. */
                    return self.isAssignmentCompleted(assignment);
                });
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

            canBeAssigned: function() {

                return this.canBeAssignedToIndexer() || this.canBeAssignedToQa();
            },

            canBeStartedByIndexer: function() {

                var self = this;

                switch (self.status) {

                    case GAME_STATUSES.READY_FOR_QA.id:
                    case GAME_STATUSES.QAING.id:
                    case GAME_STATUSES.INDEXED.id:
                        return false;
                }

                return true;
            },

            canBeStartedByQa: function() {

                var self = this;

                switch (self.status) {

                    case GAME_STATUSES.READY_FOR_INDEXING.id:
                    case GAME_STATUSES.INDEXING.id:
                    case GAME_STATUSES.QAING.id:
                    case GAME_STATUSES.NOT_INDEXED.id:
                        return false;
                }

                /* Check if all current Indexer are completed. */
                return self.areIndexerAssignmentsCompleted();
            },

            canBeAssignedToIndexer: function() {

                var self = this;

                switch (self.status) {

                    case GAME_STATUSES.INDEXING.id:
                    case GAME_STATUSES.READY_FOR_QA.id:
                    case GAME_STATUSES.QAING.id:
                    case GAME_STATUSES.INDEXED.id:
                        return false;
                }

                /* If there are no assignments yet, then the game can be assigned. */
                if (!self.indexerAssignments) return true;

                /* Otherwise; check if all current indexer assignments are completed. */
                else return self.areIndexerAssignmentsCompleted();
            },

            canBeAssignedToQa: function() {

                var self = this;

                switch (self.status) {

                    case GAME_STATUSES.READY_FOR_INDEXING.id:
                    case GAME_STATUSES.INDEXING.id:
                    case GAME_STATUSES.NOT_INDEXED.id:
                        return false;
                }

                /* If the game has a QA assignment. */
                if (self.hasQaAssignment()) {

                    /* Make sure all QA assignments are completed. */
                    return self.areQaAssignmentsCompleted();
                }

                else {

                    /* Make sure all indexer assignments are completed. */
                    return self.areIndexerAssignmentsCompleted();
                }
            },

            assignToUser: function(userId, isQa) {

                var self = this;

                self.indexerAssignments = self.indexerAssignments || [];

                var assignment = {

                    gameId: self.id,
                    userId: userId,
                    isQa: isQa
                };

                self.indexerAssignments.push(assignment);

                self.status = isQa ? GAME_STATUSES.READY_FOR_QA.id : GAME_STATUSES.READY_FOR_INDEXING.id;
            },

            assignToIndexer: function(userId) {

                var isQa = false;

                this.assignToUser(userId, isQa);
            },

            assignToQa: function(userId) {

                var isQa = true;

                this.assignToUser(userId, isQa);
            }
        };

        return GamesFactory;
    }
]);

