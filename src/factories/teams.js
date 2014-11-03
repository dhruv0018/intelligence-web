var PAGE_SIZE = 100;

var pkg = require('../../package.json');
var moment = require('moment');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.service('TeamsStorage', [
    function() {

        this.list = [];
        this.collection = {};
    }
]);

IntelligenceWebClient.factory('TeamsFactory', [
    '$injector', '$rootScope', 'ROLES', 'ROLE_ID', 'SchoolsResource', 'UsersResource', 'BaseFactory', 'UsersFactory', 'ResourceManager',
    function($injector, $rootScope, ROLES, ROLE_ID, schools, usersResource, BaseFactory, users, managedResources) {

        var TeamsFactory = {

            PAGE_SIZE: 1500,

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

            save: function(resource, success, error) {

                var self = this;

                resource = resource || self;

                managedResources.reset(resource);

                /* Create a copy of the resource to save to the server. */
                var copy = self.unextend(resource);

                angular.forEach(copy.roles, function(role) {
                    //TODO soon should remove having to convert the types
                    var roleType = role.type;
                    role.type = roleType;
                });

                parameters = {};

                success = success || function(resource) {

                    return self.extend(resource);
                };

                error = error || function() {

                    throw new Error('Could not save resource');
                };

                var model = $injector.get(self.model);
                var storage = $injector.get(self.storage);

                /* If the resource has been saved to the server before. */
                if (resource.id) {

                    /* Make a PUT request to the server to update the resource. */
                    var update = model.update(parameters, copy, success, error);

                    /* Once the update request finishes. */
                    return update.$promise.then(function() {

                        /* Fetch the updated resource. */
                        return self.fetch(resource.id).then(function(updated) {

                            /* Update local resource with server resource. */
                            angular.extend(resource, self.extend(updated));

                            /* Update the resource in storage. */
                            storage.list[storage.list.indexOf(resource)] = resource;
                            storage.collection[resource.id] = resource;

                            return resource;
                        });
                    });

                    /* If the resource is new. */
                } else {

                    /* Make a POST request to the server to create the resource. */
                    var create = model.create(parameters, copy, success, error);

                    /* Once the create request finishes. */
                    return create.$promise.then(function(created) {

                        /* Update local resource with server resource. */
                        angular.extend(resource, self.extend(created));

                        /* Add the resource to storage. */
                        storage.list.push(resource);
                        storage.collection[resource.id] = resource;

                        return resource;
                    });
                }
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
            }
        };

        angular.augment(TeamsFactory, BaseFactory);

        return TeamsFactory;
    }
]);

