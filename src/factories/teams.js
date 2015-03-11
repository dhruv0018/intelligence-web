var PAGE_SIZE = 1000;

var pkg = require('../../package.json');
var moment = require('moment');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('TeamsFactory', [
    '$injector', '$rootScope', 'ROLES', 'ROLE_ID', 'SchoolsResource', 'UsersResource', 'BaseFactory', 'UsersFactory',
    function($injector, $rootScope, ROLES, ROLE_ID, schools, usersResource, BaseFactory, users) {

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
            addRole: function(user, role) {
                var self = this;
                role.userId = user.id;
                role.teamId = self.id;
                self.roles.push(role);
            },
            getMembers: function() {

                var members = [];

                if (this.roles) {

                    for (var i = 0; i < this.roles.length; i++) {

                        var userId = this.roles[i].userId;

                        if (userId) {

                            members[userId] = usersResource.get({ id: userId });
                        }
                    }
                }

                return members;
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
             * @param {Object} team - Team to add the subscription to
             * @param {Object} subscription - Subscription object to add
             *
             * Adds the given subscription to the given team
             */
            addSubscription: function(team, subscription) {

                var self = this;

                if (!team) {
                    throw new Error('Invoked TeamsFactory.addSubscription without any argument(s)');
                }

                if (!subscription) {
                    // Only one argument is passed in, assumed to be a subscription
                    subscription = team;
                    team = self;
                }

                team.subscriptions = team.subscriptions || [];
                team.subscriptions.push(subscription);
            },

            /**
             * @class Team
             * @method hasActiveSubscription
             *
             * @param {Object} team - Team being queried
             * @returns {Boolean} - True if the team has an active subscription else False
             *
             * Indicates if a team has an active subscription
             */
            hasActiveSubscription: function(team) {

                var self = this;

                if (!team) {
                    team = self;
                }

                if (typeof team.subscriptions === 'undefined') {
                    return false;
                } else if (team.subscriptions.length === 0) {
                    return false;
                } else {
                    return true;
                }
            },

            /**
             * @class Team
             * @method hasActiveSubscription
             *
             * @param {Object} team - Team being queried
             * @returns {Object} - Most recently added active subscription
             *
             * Provides the most recently active subscription that is active today
             */
            getActiveSubscription: function(team) {

                var self = this;

                if (!team) {
                    team = self;
                }

                var today = new Date();
                var i = 0;
                while (team.subscriptions[i].activatesAt > today) {
                    // Subscription has not activated yet
                    i++;
                }
                return team.subscriptions[i];
            }
        };

        angular.augment(TeamsFactory, BaseFactory);

        return TeamsFactory;
    }
]);

