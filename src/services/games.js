var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('GamesFactory', [
    'GAME_STATUSES', 'GamesResource',
    function(GAME_STATUSES, GamesResource) {

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

            getRoster: function(teamId) {

                var self = this;

                /* Find any rosters with matching teamIds. */
                var rosters = self.rosters.filter(function(roster) {

                    return roster.teamId == teamId; /* FIXME: teamId in roster might be integer or string */

                });

                /* Pop just one roster. */
                var roster = rosters.pop();

                return roster;
            },

            currentAssignment: function() {

                if (!this.indexerAssignments) return undefined;

                /* The last assignment in the array is the current one. */
                return this.indexerAssignments.slice(-1).pop();
            },

            userAssignment: function(user) {

                var self = this;

                var assignments = self.indexerAssignments;

                if (!assignments) return undefined;

                /* Find the users assignment in the assignments. */
                var index = assignments.map(function(assignment) {

                    return assignment.userId;

                }).indexOf(user.id);

                /* Return the assignment if found. */
                return !!~index ? assignments[index] : undefined;
            },

            startAssignment: function(user, assignment) {

                var self = this;

                self.indexerAssignments = self.indexerAssignments || [];

                assignment = assignment || self.currentAssignment();

                if (assignment.timeStarted) throw new Error('Assignment already started');
                if (self.isAssignmentCompleted(assignment)) throw new Error('Assignment already completed');
                if (!self.isAssignedToUser(user, assignment)) throw new Error('Assignment not assigned to user');

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

            isAssignedToUser: function(user, assignment) {

                assignment = assignment || this.currentAssignment();

                if (!user) return false;
                if (!assignment) return false;

                return assignment.userId == user.id;
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

            canBeAssignedToIndexer: function() {

                var self = this;

                switch (self.status.id) {

                    case GAME_STATUSES.READY_FOR_INDEX.id:
                    case GAME_STATUSES.READY_FOR_QA.id:
                    case GAME_STATUSES.QAING.id:
                    case GAME_STATUSES.INDEXED.id:
                        return false;
                }

                var assignments = self.indexerAssignments;

                if (!assignments) return true;

                /* Check if all current indexer assignments are completed. */
                return assignments.every(function(assignment) {

                    /* If it is an indexer assignment. */
                    if (self.isAssignedToIndexer(assignment)) {

                        /* Make sure the assignment was completed. */
                        return self.isAssignmentCompleted(assignment);

                    /* Otherwise; if the assignment is unknown. */
                    } else {

                        /* Make the assumption that it is alright to assign to an indexer. */
                        return true;
                    }
                });
            },

            canBeAssignedToQa: function() {

                var self = this;

                switch (self.status.id) {

                    case GAME_STATUSES.READY_FOR_INDEX.id:
                    case GAME_STATUSES.READY_FOR_QA.id:
                    case GAME_STATUSES.INDEXING.id:
                    case GAME_STATUSES.NOT_INDEXED.id:
                        return false;
                }

                var assignments = self.indexerAssignments;

                if (!assignments) return false;

                /* Check if all current Indexer and QA assignments are completed. */
                return assignments.every(function(assignment) {

                    /* If it is an indexer assignment. */
                    if (self.isAssignedToIndexer(assignment)) {

                        /* It needs to be completed before QA. */
                        return self.isAssignmentCompleted(assignment);

                    /* Or if it is a QA assignment. */
                    } else if (self.isAssignedToQa(assignment)) {

                        /* Make sure the assignment was completed. */
                        return self.isAssignmentCompleted(assignment);

                    /* Otherwise; if the assignment is unknown. */
                    } else {

                        /* Make the assumption that it is alright to assign to QA. */
                        return true;
                    }
                });
            },
        };

        return GamesFactory;
    }
]);

