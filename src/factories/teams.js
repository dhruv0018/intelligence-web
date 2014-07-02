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
    '$rootScope','ROLES', 'TeamsStorage', 'TeamsResource', 'SchoolsResource', 'UsersResource', 'BaseFactory', 'UsersFactory',
    function($rootScope, ROLES, TeamsStorage, TeamsResource, schools, usersResource, BaseFactory, users) {

        var TeamsFactory = {

            description: 'teams',

            storage: TeamsStorage,

            resource: TeamsResource,

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
            },
            retrieveRoster: function() {
                var self = this;
                if (self.roster) {
                    return self.roster;
                } else {
                    self.roster = {
                        teamId: self.teamId
                    };

                    self.save().then(function(team) {
                        return team.roster;
                    });
                }
            }
        };

        angular.augment(TeamsFactory, BaseFactory);

        return TeamsFactory;
    }
]);

