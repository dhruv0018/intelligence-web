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
        sports
    ) {

        var TeamsFactory = {

            PAGE_SIZE: PAGE_SIZE,

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

                // assign to team since this method is only used on instances of a Team
                let team = this;

                let existingRole = team.getRoleByUserId(user.id);

                // Role exists for this user, do not add the same role again to team
                if (existingRole) return;

                // create new role from ROLE
                let newRole = angular.copy(ROLE);

                newRole.userId = user.id;
                newRole.teamId = team.id;
                team.roles.push(newRole);
            },

            /**
             * @class Team
             * @description Get a team role by user id
             * @param {number} userId
             * @returns {object|undefined} role The role on the team if it exists,
             */
            getRoleByUserId: function(userId) {

                if (!userId) throw new Error(`Missing parameter 'userId'`);

                // assign to team since this method is only used on instances of a Team
                let team = this;

                return team.roles.find((role) => role.userId === userId);
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
                        throw new Error('You have more than one active package for team ' + self.id);
                    } else {
                        return activePackages[0];
                    }
                }
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
            }
        };

        angular.augment(TeamsFactory, BaseFactory);

        return TeamsFactory;
    }
]);
