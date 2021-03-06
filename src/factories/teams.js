import List from '../collections/list.js';
import Subscription from '../entities/subscription.js';

var PAGE_SIZE = 1000;

var pkg = require('../../package.json');
var moment = require('moment');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('TeamsFactory', [
    '$injector',
    '$rootScope',
    'ROLES',
    'ROLE_ID',
    'SchoolsResource',
    'UsersResource',
    'BaseFactory',
    'UsersFactory',
    'LeaguesFactory',
    'SportsFactory',
    'config',
    '$q',
    function(
        $injector,
        $rootScope,
        ROLES,
        ROLE_ID,
        schools,
        usersResource,
        BaseFactory,
        users,
        leagues,
        sports,
        config,
        $q
    ) {

        var TeamsFactory = {

            PAGE_SIZE,

            description: 'teams',

            model: 'TeamsResource',

            storage: 'TeamsStorage',

            extend: function(team) {
                var self = this;

                /* If the user has roles. */
                if (team.roles) {

                    /* For each role. */
                    team.roles.forEach(function(role) {
                        /* Default the tenureEnd to null. */
                        role.tenureEnd = role.tenureEnd || null;

                        //TODO hotfixed, to be properly fixed later
                        if (!role.type.id) {
                            role.type = {
                                id: role.type
                            };
                        }

                        if (!role.type.name) {
                            role.type.name = ROLES[ROLE_ID[role.type.id]].type.name;
                        }
                    });
                } else {
                    team.roles = [];
                }

                //TODO roster related, should be put on backend at some point
                if (!team.roster) {
                    team.roster = {
                        teamId: team.id,
                        playerInfo: {}
                    };
                } else {
                    if (team.roster.playerInfo) {
                        angular.forEach(team.roster.playerInfo, function(rosterEntry, playerId) {
                            rosterEntry.id = playerId;
                        });
                    } else {
                        team.roster.playerInfo = {};
                    }
                }

                // TODO: Temporarily removed because Object.assign doesn't
                // copy Array prototype to List (Collection) classes so
                // the map method below will not work. List and Class need
                // to be refactored as Set perhaps.

                // if (team.subscriptions) {

                //     let subscriptions = team.subscriptions.map(function constructSubscription(subscription) {

                //         return new Subscription(subscription);
                //     });

                //     team.subscriptions = new List(subscriptions);
                // }
                // else {

                //     team.subscriptions = new List();
                // }

                //This is count for the added columns to the table on June, 2016
                // The check for undefined specifically is because in some cases, the default value is desired to be ""

                if(team.type === undefined){
                    team.type = 'Scholastic';
                }
                if(team.ageLevel === undefined){
                    team.ageLevel = 'Collegiate';
                }
                if(team.amateurPro === undefined){
                    team.amateurPro = 'Amateur';
                }

                angular.extend(team, self);

                return team;
            },

            unextend: function(resource) {

                var self = this;

                resource = resource || self;

                var copy = angular.copy(resource);

                angular.forEach(copy.roles, function(role) {
                    role.type = role.type.id;
                });

                delete copy.PAGE_SIZE;
                delete copy.description;
                delete copy.model;
                delete copy.storage;

                return copy;
            },

            search: function(query) {

                var self = this;

                return self.retrieve(query).then(function(teams) {

                    var schoolIds = [];

                    angular.forEach(teams, function(team) {

                        if (team.schoolId) {

                            schoolIds.push(team.schoolId);
                        }
                    });

                    if (schoolIds.length) {

                        var schools = $injector.get('SchoolsFactory');

                        return schools.retrieve({ 'id[]': schoolIds }).then(function() {

                            return teams;
                        });
                    }

                    else return teams;
                });
            },

            removeRole: function(role) {

                /* Remove role from team. */
                this.roles.splice(this.roles.indexOf(role), 1);

                /* If removing the head coach role. */
                if (role.userId && users.is(role, ROLES.HEAD_COACH)) {

                    users.get(role.userId, function(user) {

                        /* Check if they are the head coach of any other team,
                         * if not then remove the head coach role for the user. */
                        if (!user.has(ROLES.HEAD_COACH)) {

                            user.removeRole(role);
                        }
                    });
                }
            },

            /**
             * @class Team
             * @method addRole
             * @description Adds a role of type ROLE to the team. Will not add the role if
             * it already exists for the user on the team
             * @param {Object} user - the user to add the role to
             * @param {Object} ROLE - a ROLE object defining the role type to create and add
             */
            addRole: function(user, ROLE) {

                if (!user) throw new Error(`Missing parameter 'user'`);
                if (!ROLE) throw new Error(`Missing parameter 'ROLE'`);

                let existingRole = this.getRoleByUserId(user.id);

                // Role exists for this user, do not add the same role again to team
                if (existingRole) return;

                // create new role from ROLE
                let newRole = angular.copy(ROLE);

                newRole.userId = user.id;
                newRole.teamId = this.id;
                this.roles.push(newRole);
            },

            /**
             * @class Team
             * @description Get a team role by user id
             * @param {number} userId
             * @returns {object|undefined} role The role on the team if it exists,
             */
            getRoleByUserId: function(userId) {

                if (!userId) throw new Error(`Missing parameter 'userId'`);

                return this.roles.find((role) => role.userId === userId);
            },

            isMember: function(userId) {

                if (!angular.isNumber(userId)) return false;
                if (!this.roles) return false;

                var isMember = this.roles.some(function(role) {
                    return role.userId === userId;
                });

                return isMember;
            },

            getHeadCoachRole: function() {

                if (!this.roles) return undefined;

                /* Filter out all of the head coach roles for the team. */
                var headCoachRoles = this.roles.filter(function(role) {

                    return users.is(role, ROLES.HEAD_COACH);
                });
                /* Filter out all of the head coach roles that are current. */
                var currentHeadCoachRoles = headCoachRoles.filter(function(coach) {

                    return !coach.tenureEnd;
                });
                return currentHeadCoachRoles.pop();
            },

            has: function(match, matchIsCurrent) {

                var self = this;
                var roles = self.roles;

                if (!roles) return false;
                if (!match) throw new Error('No role to match specified');

                /* Check all roles for match. */
                return roles.some(function(role) {

                    /* Optionaly, check if the role is current also. */
                    if (matchIsCurrent === true) {

                        return match.type.id == role.type.id &&
                            role.tenureEnd === null;

                    } else {

                        return match.type.id == role.type.id;
                    }
                });
            },

            getActivePlan: function() {
                var self = this;

                if (self.teamPlans) {
                    //get the plans that have a endDate that has not passed
                    var activePlans = self.teamPlans.filter(function(plan) {
                        return moment().isBefore(plan.endDate);
                    });

                    if (activePlans.length === 0) {
                        return undefined;
                    } else if (activePlans.length > 1) {
                        throw new Error('You have more than one active plan for team ' + self.id);
                    } else {
                        return activePlans[0];
                    }
                }
            },

            getActivePackage: function() {
                var self = this;

                if (self.teamPackages) {
                    //get the plans that have a endDate that has not passed
                    var activePackages = self.teamPackages.filter(function(teamPackage) {
                        return moment().isBefore(teamPackage.endDate);
                    });

                    if (activePackages.length === 0) {
                        return undefined;
                    } else if (activePackages.length > 1) {
                        // If more than one package return package with higher id
                        return activePackages.sort((a, b) => b.id - a.id)[0];
                    } else {
                        return activePackages[0];
                    }
                }
            },

            getFilmExchanges: function(id, success, error) {
                var self = this;
                id = id || self.id;

                var callback = function(filmExchanges) {
                    return success ? success(filmExchanges) : filmExchanges;
                };

                error = error || function() {
                    throw new Error('Could not get film exchanges for team');
                };

                var model = $injector.get(self.model);
                return model.getFilmExchanges({ id: id }, callback, error).$promise;
            },

            getRemainingBreakdowns: function(id, success, error) {
                var self = this;
                id = id || self.id;

                var callback = function(remainingBreakdowns) {
                    return success ? success(remainingBreakdowns) : remainingBreakdowns;
                };

                error = error || function() {
                    throw new Error('Could not get remaining breakdowns for team');
                };

                var model = $injector.get(self.model);
                return model.getRemainingBreakdowns({ id: id }, callback, error).$promise;
            },

            getMaxTurnaroundTime: function() {
                var self = this;
                var activePlan = self.getActivePlan();

                if (activePlan) {
                    return activePlan.maxTurnaroundTime;
                } else {
                    var activePackage = self.getActivePackage();
                    if (activePackage) {
                        return activePackage.maxTurnaroundTime;
                    }
                }

                //no plans or packages means no breakdowns
                return 0;
            },

            generateStats: function(query) {
                var self = this;
                query.id = query.id || self.id;

                var error = function() {
                    throw new Error('Could not get stats for team');
                };

                var model = $injector.get(self.model);
                return model.generateStats(query).$promise;
            },

            getActivePlayerInfo: function() {
                var self = this;
                var activePlayerInfo = {};

                angular.forEach(self.roster.playerInfo, function(playerInfo, playerId) {
                    if (playerInfo.isActive) {
                        activePlayerInfo[playerId] = playerInfo;
                    }
                });

                return activePlayerInfo;
            },

            hasActivePlayerInfo: function() {
                var self = this;
                var activePlayerInfo = self.getActivePlayerInfo();

                return Object.keys(activePlayerInfo).length > 0;
            },

            /**
             * @class Team
             * @method addSubscription
             *
             * @param {Object} subscription - Subscription object to add
             * @param {Object} team - Team to add the subscription to
             *
             * Adds the given subscription to the given team
             */
            addSubscription: function(subscription, team = this) {

                switch (arguments.length) {
                    case 0:
                        throw new Error('Invoked TeamsFactory.addSubscription without any argument(s)');
                }

                team.subscriptions.add(subscription);
            },

            /**
             * @class Team
             * @method getActiveSubscription
             *
             * @param {Object} team - Team being queried
             * @returns {Object} - Most recently added active subscription
             *
             * Provides the most recently active subscription that is active today
             */
            getActiveSubscription: function(team = this) {
                let mostRecent = team.subscriptions.first();
                return (mostRecent.isActive ? mostRecent : undefined);
            },

            /**
             * @class Team
             * @method getSport
             *
             * Gets the sport for this team
             */
            getSport: function() {
                let league = leagues.get(this.leagueId);
                let sport = sports.get(league.sportId);
                return sport;
            },
            /**
             * @class Team
             * @method getAvailableConferences
             *
             * Gets all the available conferences for this team
             */
            getAvailableConferences: function(id){
                let self = this;
                let model = $injector.get(self.model);
                id = id || self.id;

                return model.getAvailableConferences({teamId: id}).$promise;

            },
            /**
             * @class Team
             * @method addConference
             *
             * Add one conference to a team
             */
            addConference: function(id, conference){
                let self = this;
                let model = $injector.get(self.model);
                id = id || self.id;
                return model.createConference({id}, conference).$promise;
            },
            /**
             * @class Team
             * @method getConferences
             *
             * Gets all the conferences for this team
             */
            getConferences: function(id){
                let self = this;
                let model = $injector.get(self.model);
                id = id || self.id;

                return model.getConferences({id: id}).$promise;

            },
            /**
             * @class Team
             * @method updateConference
             *
             * Update conference for this team
             */
            updateConference: function(id, conference){
                let self = this;
                let model = $injector.get(self.model);
                id = id || self.id;

                return model.updateConference({id: id, conferenceId: conference.id}, conference).$promise;

            },
            /**
             * @class Team
             * @method deleteConferences
             *
             * Gets a conference for this team
             */
            deleteConference: function(id, conferenceId){
                let self = this;
                let model = $injector.get(self.model);
                id = id || self.id;

                return model.deleteConference({id: id, conferenceId: conferenceId}).$promise;

            },
            /**
             * @class Team
             * @method getOpponentTeam
             *
             * Gets all the opponent teams based on teamId and opponentTeamName search
             */
            getOpponentTeam: function(filter){
                let self = this;
                let model = $injector.get(self.model);
                if(!filter.conferenceTeamId){
                    throw new Error('Could not get opponent team without teamId');
                }

                return model.getOpponentTeam(filter).$promise;

            },
            /**
             * @class Team
             * @method getTeamsList
             *
             * Gets all the teams based on the filter and page requested.
             *
             * @param {Object} filter - Filter to query by
             * @param {bool} getHead - Whether or not to add the total count to the response.
             * @returns {Object} - contains teams data attribute and a count arribute if requested
             *
             */
            getTeamsList(filter, getHead = true) {
                const model = $injector.get(this.model);
                let query = filter || {};
                query.count = (filter && filter.count) ? filter.count :  30;
                query.start = (filter && filter.page) ? (filter.page-1) * query.count : 0;
                delete query.page;
                let teamPromises = model.getTeamsList(query).$promise.then(function (teams) {
                    return teams;
                });
                let promises = [teamPromises];

                if(getHead) {
                    let url = `${config.api.uri}teams`;
                    let countPromises = this.totalCount(query, url);
                    promises.push(countPromises);
                }
                return $q.all(promises).then(
                    data =>{
                        let teams = {};
                        teams.data = data[0];
                        if(getHead) {
                            teams.count = data[1];
                        }
                        return teams;
                    }
                );
            }
        };

        angular.augment(TeamsFactory, BaseFactory);

        return TeamsFactory;
    }
]);
