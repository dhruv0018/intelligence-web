import Video from '../entities/video';

var PAGE_SIZE = 20;

var moment = require('moment');

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('GamesFactory', [
    'config', '$injector', '$sce', 'ROLES', 'GAME_STATUSES', 'GAME_STATUS_IDS', 'GAME_TYPES_IDS', 'GAME_TYPES', 'VIDEO_STATUSES', 'Utilities', 'SessionService', 'BaseFactory', 'GamesResource', 'PlayersFactory', 'TeamsFactory', 'UsersFactory', '$q', 'PlayTelestrationEntity', 'RawTelestrationEntity',
    function(config, $injector, $sce, ROLES, GAME_STATUSES, GAME_STATUS_IDS, GAME_TYPES_IDS, GAME_TYPES, VIDEO_STATUSES, utilities, session, BaseFactory, GamesResource, players, teams, users, $q, playTelestrationEntity, rawTelestrationEntity) {

        var GamesFactory = {

            PAGE_SIZE: 1000,

            description: 'games',

            model: 'GamesResource',

            storage: 'GamesStorage',
            unextend: function(game) {

                var self = this;

                game = game || self;

                /* Create a copy of the resource to break reference to original. */

                let copy = Object.assign({}, game);

                // remove attributes that are circular
                delete copy.$promise;
                delete copy.flow;

                // copy share attributes that rely on game functions.
                // TODO: This sharing copying should not have to be done. It should model reels implementation.

                if (copy.isSharedWithPublic()) {
                    copy.shares.push(copy.publicShare);
                }

                copy.shares.forEach(function (share) {

                    share.isBreakdownShared = JSON.parse(share.isBreakdownShared);
                });

                // Unextend any children objects
                Object.keys(copy).forEach(function assignCopies(key) {

                    if (copy[key] && copy[key].unextend) copy[key] = copy[key].unextend();
                });

                /*
                 * FIXME:
                 * Using Object.assign to strip video of getters during
                 * resource save to in order to pass JSON validation.
                 * TODO:
                 * delete copy.video.resourceUrls;
                 * delete copy.video.transcodeProfiles;
                 * Investigate why ^ doesn't work
                 */
                copy.video = Object.assign({}, copy.video);

                if (copy.video.videoTranscodeProfiles) {
                    copy.video.videoTranscodeProfiles = copy.video.videoTranscodeProfiles.map(profile => Object.assign({}, profile.toJSON()));
                }

                return copy;
            },
            extend: function(game) {

                var self = this;

                angular.augment(game, self);
                game.isSaving = false;
                game.video = game.video ? new Video(game.video) : null;
                game.notes = game.notes || {};
                game.isDeleted = game.isDeleted || false;
                game.datePlayed = game.datePlayed || moment.utc().toDate();
                game.primaryJerseyColor = game.primaryJerseyColor || '#FFFFFF';
                game.opposingPrimaryJerseyColor = game.opposingPrimaryJerseyColor || '#000000';

                //TODO remove when the back end makes notes always a object
                if (angular.isArray(game.notes)) {
                    game.notes = {};
                }

                if (!game.uploaderUserId && session.currentUser && session.currentUser.id) {
                    game.uploaderUserId = session.currentUser.id;
                }

                if (!game.uploaderTeamId && session.currentUser && session.currentUser.currentRole && session.currentUser.currentRole.teamId) {
                    game.uploaderTeamId = session.currentUser.currentRole.teamId;
                }

                /* build lookup table of shares by userId shared with */
                game.shares = game.shares || [];
                game.sharedWithUsers = game.sharedWithUsers || {};
                game.sharedWithTeams = game.sharedWithTeams || {};

                //Sort indexer assignments by time assigned
                if(game.indexerAssignments && game.indexerAssignments.length > 1) {
                    game.indexerAssignments.sort((a,b) => moment.utc(b.timeAssigned).diff(moment.utc(a.timeAssigned)));
                }

                if (game.shares && game.shares.length) {

                    angular.forEach(game.shares, function(share, index) {
                        if (share.sharedWithUserId) {
                            game.sharedWithUsers[share.sharedWithUserId] = share;
                        } else if (share.sharedWithTeamId) {
                            game.sharedWithTeams[share.sharedWithTeamId] = share;
                        } else if (!share.sharedWithUserId && !share.sharedWithTeamId) {
                            game.publicShare = share;
                            game.shares.splice(index, 1);
                        }
                    });
                }

                // Extend Telestration Entities
                game.rawTelestrations = game.rawTelestrations || [];
                game.playTelestrations = game.playTelestrations || [];

                if (!game.rawTelestrations.unextend) rawTelestrationEntity(game.rawTelestrations, game.id);
                if (!game.playTelestrations.unextend) playTelestrationEntity(game.playTelestrations, game.id);

                return game;
            },

            getByUploaderUserId: function(userId) {

                userId = userId || session.getCurrentUserId();

                if (!userId) throw new Error('No userId');

                var games = this.getList();

                return games.filter(function(game) {

                    return game.uploaderUserId == userId;
                });
            },

            getByUploaderTeamId: function(teamId) {

                if (!teamId) throw new Error('No teamId');

                var self = this;

                var games = self.getList();

                return games.filter(function(game) {

                    return game.uploaderTeamId == teamId;
                });
            },

            getByUploaderRole: function(userId, teamId) {

                userId = userId || session.getCurrentUserId();
                teamId = teamId || session.getCurrentTeamId();

                if (!userId) throw new Error('No userId');
                if (!teamId) throw new Error('No teamId');

                var games = this.getList();

                return games.filter(function(game) {

                    return game.uploaderUserId == userId &&
                        game.uploaderTeamId == teamId;
                });
            },

            getBySharedWithUser: function(user) {

                var self = this;

                var games = self.getList();

                return games.filter(function(game) {

                    return game.isSharedWithUser(user);
                });
            },

            getBySharedWithUserId: function(userId) {

                let games = this.getList();

                return games.filter(game => game.isSharedWithUserId(userId));

            },

            getBySharedWithTeamId: function(teamId) {

                let games = this.getList();

                return games.filter(game => game.isSharedWithTeamId(teamId));
            },

            getByRelatedRole: function(userId, teamId) {

                userId = userId || session.getCurrentUserId();
                teamId = teamId || session.getCurrentTeamId();

                var games = [];
                if (session.currentUser.is(ROLES.COACH)) {
                    games = games.concat(
                            this.getByUploaderRole(userId, teamId),
                            this.getByUploaderTeamId(teamId),
                            this.getBySharedWithTeamId(teamId));
                }

                else if (session.currentUser.is(ROLES.ATHLETE)) {

                    const user = session.getCurrentUser();

                    games = games.concat(this.getByUploaderUserId(userId));

                    user.roles.forEach(role => {
                        if (role.type.id === ROLES.ATHLETE.type.id) {
                            games = games.concat(this.getByUploaderTeamId(role.teamId));
                        }
                    });
                }

                games = games.concat(this.getBySharedWithUserId(userId));

                const gameIds = utilities.unique(this.getIds(games));

                return this.getList(gameIds);
            },

            getHeadCoachName: function() {

                if (!this.uploaderTeamId) throw new Error('No uploader team id');
                let uploaderTeamId = this.uploaderTeamId;

                let team = teams.get(uploaderTeamId);
                if (!team) throw new Error('Team does not exist');

                let headCoachRole = team.getHeadCoachRole();
                let user = users.get(headCoachRole.userId);
                if (!user) throw new Error('User does not exist');

                return user.name;
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

            isPlayerOnTeam: function(playerId) {

                var self = this;

                var teamId = self.teamId;
                var teamRoster = self.getRoster(teamId);
                var playerInfo = teamRoster.playerInfo;

                if (!playerInfo) return false;

                /* Check if the player is on the team roster. */
                return angular.isDefined(playerInfo[playerId]);
            },

            /**
            * @class Games
            * @method
            * @returns {Boolean} returns if user can view game
            * or not.
            * Check if the user is allowed to view a given game.
            */
            isAllowedToView: function() {
                let currentUser = session.getCurrentUser();
                //Check if user has permissions to view game
                return  this.isSharedWithPublic() ||
                        this.uploaderUserId === session.getCurrentUserId() ||
                        this.uploaderTeamId === session.getCurrentTeamId() ||
                        this.isSharedWithCurrentUser();

            },

            isPlayerOnOpposingTeam: function(playerId) {

                var self = this;

                var opposingTeamId = self.opposingTeamId;
                var opposingTeamRoster = self.getRoster(opposingTeamId);
                var playerInfo = opposingTeamRoster.playerInfo;

                if (!playerInfo) return false;

                /* Check if the player is on the opposing team roster. */
                return angular.isDefined(playerInfo[playerId]);
            },

            generateStats: function(id, success, error) {
                var self = this;

                id = id || self.id;

                var callback = function(stats) {

                    return success ? success(stats) : stats;
                };

                error = error || function() {

                    throw new Error('Could not get stats for game');
                };

                var model = $injector.get(self.model);

                return model.generateStats({ id: id }, callback, error).$promise;
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

                if (!self.rosters) throw new Error('No game rosters');

                var roster = self.rosters[teamId];

                if (!roster) throw new Error('No team roster for game');

                return roster;
            },

            getTeamPlayers: function() {

                var self = this;

                var teamId = self.teamId;
                var teamRoster = self.getRoster(teamId);
                var playerInfo = teamRoster.playerInfo;

                if (!playerInfo) return [];

                var teamPlayers = Object.keys(playerInfo)

                .filter(function(playerId) {

                    return teamRoster.playerInfo[playerId].isActive;
                })

                .map(function(playerId) {

                    return players.get(playerId);
                });

                return teamPlayers;
            },

            getOpposingTeamPlayers: function() {

                var self = this;

                var opposingTeamId = self.opposingTeamId;
                var opposingTeamRoster = self.getRoster(opposingTeamId);
                var playerInfo = opposingTeamRoster.playerInfo;

                if (!playerInfo) return [];

                var opposingTeamPlayers = Object.keys(playerInfo)

                .filter(function(playerId) {

                    return opposingTeamRoster.playerInfo[playerId].isActive;
                })

                .map(function(playerId) {

                    return players.get(playerId);
                });

                return opposingTeamPlayers;
            },

            getPlayers: function() {

                var self = this;

                var teamPlayers = self.getTeamPlayers();
                var opposingTeamPlayers = self.getOpposingTeamPlayers();

                var players = teamPlayers.concat(opposingTeamPlayers);

                return players;
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

                if (!self.isVideoTranscodeComplete()) return false;

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

                if (!self.isVideoTranscodeComplete()) return false;

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

                deadline = deadline || new Date();

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
                    self.indexerAssignments.unshift(assignment);

                    /* Update game status. */
                    self.status = GAME_STATUSES.INDEXING.id;
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

                deadline = deadline || new Date();

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
                    self.indexerAssignments.unshift(assignment);

                    /* Update game status. */
                    self.status = GAME_STATUSES.QAING.id;
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

                /* The first assignment is the newest since indexer assignments
                    are sorted in the extend in descending order
                */
                return this.indexerAssignments[0];
            },

            userAssignment: function(userId=null) {

                var self = this;

                if(!userId) {
                    userId = session.getCurrentUserId();
                }

                var assignments = self.indexerAssignments;

                if (!assignments) return undefined;

                /* Find the users assignment in the assignments. */
                var index = assignments.map(assignment => assignment.userId).indexOf(userId);

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

                var now = moment.utc();
                var deadline = moment.utc(assignment.deadline);
                var timeRemaining = moment.duration(deadline.diff(now));

                return timeRemaining.asMilliseconds();
            },

            setAsideFromIndexing: function() {

                var self = this;
                var assignment = self.currentAssignment();

                if (!assignment) return false;

                /* If the game was not set aside, return false. */
                if (self.status != GAME_STATUSES.SET_ASIDE.id) return false;

                /* Return true if the game was assigned to an indexer. */
                return (self.isAssignedToIndexer(assignment) && !assignment.timeFinished) ? true : false;
            },

            setAsideFromQa: function() {

                var self = this;
                var assignment = self.currentAssignment();

                if (!assignment) return false;

                /* If the game was not set aside, return false. */
                if (self.status != GAME_STATUSES.SET_ASIDE.id) return false;

                /* Return true if the game was assigned to QA. */
                return (self.isAssignedToQa(assignment) || (!self.setAsideFromIndexing())) ? true : false;
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

                if (self.isDeleted) {
                    return false;
                }

                if (self.deadlinePassed()) {
                    return false;
                }

                if (!self.isAssignedToIndexer()) {
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

                if (self.isDeleted) {
                    return false;
                }

                if (self.deadlinePassed()) {
                    return false;
                }

                if (!self.isAssignedToQa()) {
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

                var self = this;

                game = game || self;

                game = game || this;

                switch (game.gameType) {
                    case GAME_TYPES.CONFERENCE.id:
                    case GAME_TYPES.NON_CONFERENCE.id:
                    case GAME_TYPES.PLAYOFF.id:
                        return true;
                }

                return false;
            },

            isNonRegular: function(game) {

                var self = this;

                game = game || self;

                game = game || this;

                switch (game.gameType) {

                    case GAME_TYPES.SCOUTING.id:
                    case GAME_TYPES.SCRIMMAGE.id:
                        return true;
                }

                return false;
            },

            getFormationReport: function() {

                var self = this;

                var model = $injector.get(self.model);

                if (!self.id) throw new Error('Game must be saved before generating reports');

                return model.getFormationReport({ id: self.id });
            },

            /**
             * copy a game to team
             * @param {Integer} teamId - the team ID of the team for which the
             * game should be copied.
             */
            copy: function(teamId) {

                let self = this;

                if (!self.id) throw new Error('Game must exist to copy');

                const copyCriteria = {
                    teamId : teamId,
                    gameId : self.id
                };

                let Resource = $injector.get(self.model);
                let copyResource = new Resource(copyCriteria);

                return $q.when(copyResource.$copy());
            },

            getDownAndDistanceReport: function(report) {

                /* TODO: the only thing used from parameter is gameId */

                var self = this;

                /* TODO: gameId should come from self if not given. */

                var Resource = $injector.get(self.model);

                var dndReport = new Resource(report);

                return $q.when(dndReport.$generateDownAndDistanceReport({ id: report.gameId }));
            },

            /**
             * Retrieves the arena events for a game, and stores in game storage
             * @param {?game} game Defaults to the thisObject
             * @returns {arenaEvent[]}
             */
            retrieveArenaEvents: function(game = this) {

                let model = $injector.get(game.model);
                let storage = $injector.get(game.storage);

                if (!game.hasOwnProperty('id')) throw new Error(`Game has no id. Game must be saved before retrieving arena events`);

                const query = model.retrieveArenaEvents({ id: game.id});
                const request = query.$promise;

                // TODO: Store separately from on a game so retrieving arena events can be independant of loading a game
                const receiveArenaEvents = (arenaEvents) => {
                    game.arenaEvents = arenaEvents;
                    storage.set(game);
                };

                const retrieveArenaEventsError = (reason) => {
                    // No arena events at this time
                    this.arenaEvents = [];
                    storage.set(this);
                };

                request.then(receiveArenaEvents, retrieveArenaEventsError);

                return request;
            },

            /**
             * Gets the arena events for a game
             * @returns {arenaEvent[]}
             */
            getArenaEvents: function() {

                if (!this.hasOwnProperty('arenaEvents')) throw new Error(`'arenaEvents' on game is not defined`);

                return this.arenaEvents;
            },

            getRemainingTime: function(uploaderTeam, now) {

                var self = this;

                now = now || moment.utc();

                if (!self.submittedAt) return 0;

                var submittedAt = moment.utc(self.submittedAt);

                if (!submittedAt.isValid()) return 0;

                var timePassed = moment.duration(submittedAt.diff(now));
                var turnaroundTime = moment.duration(uploaderTeam.getMaxTurnaroundTime(), 'hours');

                var timeRemaining = moment.duration();

                if (timePassed < 0) {

                    timeRemaining = turnaroundTime.add(timePassed);
                }

                else {

                    timeRemaining = turnaroundTime.subtract(timePassed);
                }

                return timeRemaining.asMilliseconds();
            },
            getDeadlineToReturnGame: function(uploaderTeam) {

                if (!this.submittedAt) return 0;

                let submittedAt = moment.utc(this.submittedAt);

                if (!submittedAt.isValid()) return 0;

                let turnaroundTime = moment.duration(uploaderTeam.getMaxTurnaroundTime(), 'hours');

                return submittedAt.add(turnaroundTime).format();
            },
            setAside: function() {
                var self = this;
                self.status = GAME_STATUSES.SET_ASIDE.id;
            },
            unassign: function() {
                var self = this;

                if (self.status === GAME_STATUSES.READY_FOR_INDEXING.id || self.status === GAME_STATUSES.READY_FOR_QA.id)
                    return;

                if (self.setAsideFromIndexing() || self.status === GAME_STATUSES.INDEXING.id) {
                    self.status = GAME_STATUSES.READY_FOR_INDEXING.id;
                } else if (self.setAsideFromQa() || self.status === GAME_STATUSES.QAING.id) {
                    self.status = GAME_STATUSES.READY_FOR_QA.id;
                } else {
                    throw new Error('This game cannot be unassigned from the current status');
                }
            },
            revert: function() {
                var self = this;

                if (GAME_STATUSES.QAING.id) {
                    self.status = GAME_STATUSES.READY_FOR_INDEXING.id;
                } else {
                    throw new Error('You may not revert from the current game status');
                }

            },
            findLastIndexerAssignment: function() {
                let self = this;

                if (!self.indexerAssignments) {
                    throw new Error('no indexer assignments');
                }

                let index = self.indexerAssignments.length;

                //iterate through the assignments looking for the first indexer assignment
                for (let i=0; i < index; i++) {
                    if (!self.indexerAssignments[i].isQa) {
                        return self.indexerAssignments[i];
                    }
                }

                throw new Error('An indexer assignment could not be located');

            },
            isDelivered: function() {
                var self = this;
                return self.status === GAME_STATUSES.FINALIZED.id;
            },
            isShared: function() {
                var self = this;
                return self.status === GAME_STATUSES.NOT_INDEXED.id;
            },
            isVideoTranscodeComplete: function() {
                var self = this;
                return self.video.status === VIDEO_STATUSES.COMPLETE.id;
            },
            isUploading: function() {
                var self = this;
                //return self.video.status === VIDEO_STATUSES.INCOMPLETE.id;
                return false;
            },
            isProcessing: function() {
                var self = this;
                //return self.video.status === VIDEO_STATUSES.UPLOADED.id;
                return self.video.status === VIDEO_STATUSES.INCOMPLETE.id;
            },
            isVideoTranscodeFailed: function() {
                var self = this;
                return self.video.status === VIDEO_STATUSES.FAILED.id;
            },
            isBeingBrokenDown: function() {
                var self = this;
                var isBeingBrokenDown = false;

                switch (self.status) {
                    case GAME_STATUSES.INDEXING.id:
                    case GAME_STATUSES.READY_FOR_QA.id:
                    case GAME_STATUSES.QAING.id:
                    case GAME_STATUSES.SET_ASIDE.id:
                    case GAME_STATUSES.INDEXED.id:
                        isBeingBrokenDown = true;
                        break;
                }

                return isBeingBrokenDown;
            },

            shareWithUser: function(user, isTelestrationsShared = false) {

                var self = this;

                if (!user) throw new Error('No user to share with');

                self.shares = self.shares || [];

                self.sharedWithUsers = self.sharedWithUsers || {};

                if (self.isSharedWithUser(user)) return;

                var share = {
                    userId: session.currentUser.id,
                    gameId: self.id,
                    sharedWithUserId: user.id,
                    createdAt: moment.utc().toDate(),
                    isBreakdownShared: false,
                    isTelestrationsShared: isTelestrationsShared
                };

                self.sharedWithUsers[user.id] = share;

                self.shares.push(share);
            },

            /**
             * share game with team
             * @param {Object} team - team to be shared with
             * @param {boolean} [isTelestrationsShared]
             * @throws {Error} if the team is not avaliable to share.
             */
            shareWithTeam: function(team, isTelestrationsShared = false) {

                if (!team) throw new Error('No team to share with');

                this.shares = this.shares || [];

                this.sharedWithTeams = this.sharedWithTeams || {};

                if (this.isSharedWithTeam(team)) return;

                const share = {
                    userId: session.currentUser.id,
                    gameId: this.id,
                    sharedWithTeamId: team.id,
                    createdAt: moment.utc().toDate(),
                    isBreakdownShared: false,
                    isTelestrationsShared
                };

                this.sharedWithTeams[team.id] = share;

                this.shares.push(share);
            },

            /**
             * stop sharing game
             * @param {Object} share - shared with object
             * @throws {Error} if the share object is not avaliable.
             */
            stopSharing: function(share) {

                if (!share) throw new Error('No share to remove');

                if (!this.shares || !this.shares.length) return;

                for (var index = 0; index < this.shares.length; index++) {
                    if ((this.shares[index].sharedWithUserId === share.sharedWithUserId) &&
                            (this.shares[index].sharedWithTeamId === share.sharedWithTeamId)) {
                        this.shares.splice(index, 1);
                        if (share.sharedWithUserId) {
                            delete this.sharedWithUsers[share.sharedWithUserId];
                        }
                        if (share.sharedWithTeamId) {
                            delete this.sharedWithTeams[share.sharedWithTeamId];
                        }
                        return;
                    }
                }
            },

            getShareByUser: function(user) {
                var self = this;

                if (!self.sharedWithUsers) throw new Error('sharedWithUsers not defined');

                if (!user) throw new Error('No user to get share from');

                var userId = user.id;

                return self.getShareByUserId(userId);
            },

            /**
             * get game sharing by team
             * @param {Object} team - shared with team
             * @throws {Error} if the sharedWithTeams or team objects are not avaliable.
             * @return {Object}
             */
            getShareByTeam: function(team) {
                if (!this.sharedWithTeams) throw new Error('sharedWithTeams not defined');

                if (!team) throw new Error('No team to get share from');

                return this.getShareByTeamId(team.id);
            },

            /**
             * get game sharing by logged in user
             * @return {Object}
             */
            getShareByCurrentUser: function() {

                let currentUser = session.getCurrentUser();
                if (this.isSharedWithUser(currentUser)) {
                    return this.getShareByUser(currentUser);
                }

                const teamId = session.getCurrentTeamId();
                if ((currentUser.is(ROLES.COACH)) && this.isSharedWithTeamId(teamId)) {
                    return this.getShareByTeamId(teamId);
                }

            },

            getShareByUserId: function(userId) {
                var self = this;

                if (!self.sharedWithUsers) throw new Error('sharedWithUsers not defined');

                return self.sharedWithUsers[userId];
            },

            /**
             * get game sharing by teamId
             * @param {Integer} teamId - shared with team
             * @throws {Error} if the sharedWithTeams are not avaliable.
             * @return {Object}
             */
            getShareByTeamId: function(teamId) {
                if (!this.sharedWithTeams) throw new Error('sharedWithTeams not defined');

                return this.sharedWithTeams[teamId];
            },

            isSharedWithUser: function(user) {
                var self = this;

                if (!user) return false;

                if (!self.sharedWithUsers) return false;

                return angular.isDefined(self.getShareByUser(user));
            },

            /**
             * check game shared with team
             * @param {Object} team - shared with team
             * @return {boolean}
             */
            isSharedWithTeam: function(team) {
                if (!team) return false;

                if (!this.sharedWithTeams) return false;

                return !!this.getShareByTeam(team);
            },

            /**
             * check reel shared with loggedin user
             * @return {boolean}
             */
            isSharedWithCurrentUser: function() {

                let currentUser = session.getCurrentUser();
                return this.isSharedWithUser(currentUser) ||
                        ((currentUser.is(ROLES.COACH)) && this.isSharedWithTeamId(session.getCurrentTeamId()));

            },

            /**
             * check reel shared with loggedin user
             * @return {boolean}
             */
            isBreakdownSharedWithCurrentUser: function() {

                return this.isSharedWithCurrentUser() && this.getShareByCurrentUser().isBreakdownShared;

            },

            isSharedWithUserId: function(userId) {
                var self = this;

                if (!userId) return false;

                if (!self.sharedWithUsers) return false;

                return angular.isDefined(self.getShareByUserId(userId));
            },

            /**
             * check game shared with teamId
             * @param {Integer} teamId - shared with team
             * @return {boolean}
             */
            isSharedWithTeamId: function(teamId) {
                if (!teamId) return false;

                if (!this.sharedWithTeams) return false;

                return angular.isDefined(this.getShareByTeamId(teamId));
            },
            getUserShares: function() {
                var self = this;

                if (!self.sharedWithUsers) throw new Error('sharedWithUsers not defined');

                var sharesArray = [];

                angular.forEach(self.sharedWithUsers, function(share, index) {
                    sharesArray.push(share);
                });

                return sharesArray;
            },

            /**
             * get team shares of game
             * @return {Array}
             */
            getTeamShares: function() {
                if (!this.sharedWithTeams) throw new Error('sharedWithTeams not defined');

                let sharesArray = [];
                angular.forEach(this.sharedWithTeams, function(share, index) {
                    sharesArray.push(share);
                });
                return sharesArray;
            },

            /**
             * get all shares excluding the public share
             * @return {Array}
             */
            getNonPublicShares: function() {
                return this.shares.filter(share => !this.isPublicShare(share));
            },

            togglePublicSharing: function(isTelestrationsShared = false) {
                var self = this;

                self.shares = self.shares || [];

                if (self.isSharedWithPublic()) {
                    delete self.publicShare;
                } else {
                    var share = {
                        userId: session.getCurrentUserId(),
                        teamId: session.getCurrentTeamId(),
                        gameId: self.id,
                        sharedWithUserId: null,
                        createdAt: moment.utc().toDate(),
                        isBreakdownShared: false,
                        isTelestrationsShared: isTelestrationsShared
                    };

                    self.publicShare = share;
                }
            },
            isSharedWithPublic: function() {
                var self = this;

                return !!self.publicShare;
            },
            getPublicShare: function() {
                var self = this;

                return self.publicShare;
            },

            /**
             * check if the share is public share object
             * @param {Object} share
             * @return {boolean}
             */
            isPublicShare: function(share) {
                return share === this.getPublicShare();
            },

            isFeatureSharedPublicly: function(featureAttribute) {
                var self = this;

                if (!featureAttribute) throw new Error('Missing \'featureAttribute\' parameter');
                if (typeof featureAttribute !== 'string') throw new Error('featureAttribute parameter must be a string');

                var publicShare = self.getPublicShare();

                if (angular.isDefined(publicShare) && publicShare[featureAttribute] === true) return true;
            },
            isFeatureSharedWithUser: function(featureAttribute, user) {
                var self = this;

                if (!featureAttribute) throw new Error('Missing \'featureAttribute\' parameter');
                if (typeof featureAttribute !== 'string') throw new Error('featureAttribute parameter must be a string');

                var userShare = self.getShareByUser(user);

                if (angular.isDefined(userShare) && userShare[featureAttribute] === true) return true;
            },

            /**
             * check a feature of game is shared with team
             * @param {Object} team - shared with team
             * @return {boolean}
             */
            isFeatureSharedWithTeam: function(featureAttribute, team) {
                if (!featureAttribute) throw new Error('Missing \'featureAttribute\' parameter');
                if (typeof featureAttribute !== 'string') throw new Error('featureAttribute parameter must be a string');

                const teamShare = this.getShareByTeam(team);

                return !!(angular.isDefined(teamShare) && teamShare[featureAttribute]);
            },
            isTelestrationsSharedWithUser: function(user) {
                var self = this;

                return self.isFeatureSharedWithUser('isTelestrationsShared', user);
            },

            /**
             * check teletration for game are shared with team
             * @param {Object} team - shared with team
             * @return {boolean}
             */
            isTelestrationsSharedWithTeam: function(team) {
                return this.isFeatureSharedWithTeam('isTelestrationsShared', team);
            },
            isTelestrationsSharedPublicly: function() {
                var self = this;

                return self.isFeatureSharedPublicly('isTelestrationsShared');
            },
            /*
             * Determines if the user is the uploader (owner) of this game
             * @param - userId
             * @returns {boolean}
             */
            isUploader: function isUploader(userId) {
                var self = this;

                return userId === self.uploaderUserId;
            },
            /*
             * Determines if the team given is the same as the uploader's (owner) team
             * @param - teamId
             * @returns {boolean}
             */
            isTeamUploadersTeam: function isTeamUploadersTeam(teamId) {
                var self = this;

                return teamId === self.uploaderTeamId;
            },

            /**
             * @returns {String} flagsUrl
             */
            getFlagsUrl: function getFlagsUrl() {

                return `${config.api.uri}flags?id=${this.id}`;
            },

            /**
             * Determine if the game is copied
             * @returns {boolean}
             */
            isCopied: function () {
                return this.copiedFromGameId !== null;
            }
        };

        angular.augment(GamesFactory, BaseFactory);

        return GamesFactory;
    }
]);
