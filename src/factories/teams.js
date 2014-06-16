var PAGE_SIZE = 100;

var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.service('TeamsStorage', [
    function() {

        this.list = [];
        this.collection = {};
    }
]);

IntelligenceWebClient.factory('TeamsFactory', [
    '$rootScope','ROLES', 'TeamsResource', 'SchoolsResource', 'UsersResource', 'UsersFactory', 'TeamsStorage',
    function($rootScope, ROLES, TeamsResource, schools, usersResource, users, TeamsStorage) {

        var dateModifyArray = 'teamPackages teamPlans'.split(' ');
        var dateModifyArrayProperties = 'startDate endDate'.split(' ');

        function parseDateStringsIntoObjects(team) {
            dateModifyArray.map(function(arrayToModify) {

                if (typeof team[arrayToModify] === 'undefined') return;

                angular.forEach(team[arrayToModify], function(value, key) {

                    dateModifyArrayProperties.map(function(dateProperty) {

                        if (typeof value[dateProperty] === 'undefined') return;

                        var dateObj;

                        if (angular.isString(value[dateProperty]) &&
                            !isNaN((dateObj = new Date(value[dateProperty])).getTime())) {

                            value[dateProperty] = dateObj;
                        }
                    });
                });
            });
        }

        function stringifyDateObjects(team) {
            dateModifyArray.map(function(arrayToModify) {

                if (typeof team[arrayToModify] === 'undefined') return;

                angular.forEach(team[arrayToModify], function(value, key) {

                    dateModifyArrayProperties.map(function(dateProperty) {

                        if (typeof value[dateProperty] === 'undefined') return;

                        if (value[dateProperty] instanceof Date) value[dateProperty] = value[dateProperty].toISOString();
                    });
                });
            });
        }

        var TeamsFactory = {

            resource: TeamsResource,

            storage: TeamsStorage,

            description: 'teams',

            extendTeam: function(team) {

                var self = this;

                /* Copy all of the properties from the retrieved $resource
                 * "team" object. */
                angular.extend(team, self);

                return team;
            },

            get: function(id, success, error) {

                var self = this;

                var callback = function(team) {

                    team = self.extendTeam(team);

                    return success ? success(team) : team;
                };

                error = error || function() {

                    throw new Error('Could not get team');
                };

                return self.resource.get({ id: id }, callback, error);
            },

            load: function(filter) {

                var self = this;

                return self.storage.promise || (self.storage.promise = self.getAll(filter));
            },

            getAll: function(filter, success, error) {

                var self = this;

                filter = filter || {};
                filter.start = filter.start || 0;
                filter.count = filter.count || PAGE_SIZE;

                success = success || function(resources) {

                    return resources;
                };

                error = error || function() {

                    throw new Error('Could not load ' + self.description + 's collection');
                };

                var query = self.resource.query(filter, success, error);

                return query.$promise.then(function(resources) {

                    self.storage.list = self.storage.list.concat(resources);

                    resources.forEach(function(resource) {
                        resource = self.extendTeam(resource);
                        self.storage.collection[resource.id] = resource;
                    });

                    if (resources.length < filter.count) {

                        return self.storage.collection;
                    }

                    else {

                        filter.start = filter.start + filter.count + 1;

                        return self.getAll(filter);
                    }
                });
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

                var callback = function(teams) {

                    var indexedTeams = {};

                    teams.forEach(function(team) {

                        team = self.extendTeam(team);

                        indexedTeams[team.id] = team;
                    });

                    teams = index ? indexedTeams : teams;

                    return success ? success(teams) : teams;
                };

                error = error || function() {

                    throw new Error('Could not load teams list');
                };

                return self.resource.query(filter, callback, error);
            },

            save: function(team, success, error) {

                var self = this;

                team = team || self;

                delete team.league;
                delete team.members;
                delete team.storage;
                delete team.resource;
                delete team.description;

                if (team.schoolId) delete team.address;

                parameters = {};

                success = success || function(team) {

                    return self.extendTeam(team);
                };

                error = error || function() {

                    throw new Error('Could not save team');
                };

                if (team.id) {

                    var updatedTeam = self.resource.update(parameters, team, success, error);
                    return updatedTeam.$promise;

                } else {

                    var newTeam = self.resource.create(parameters, team, success, error);
                    return newTeam.$promise;
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
            }
        };

        return TeamsFactory;
    }
]);

