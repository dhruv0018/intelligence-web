/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Profile
 * @module roster-manager
 */
var Profile = angular.module('Profile', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
Profile.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('profile.html', require('./template.html'));
    }
]);

/**
 * Profile directive.
 * @module Profile
 * @name Profile
 * @type {Directive}
 */
Profile.directive('profile', [
    '$timeout', 'UsersFactory', 'PlayersFactory', 'ROLE_TYPE', 'EMAIL_REQUEST_TYPES',
    function directive($timeout, users, players, ROLE_TYPE, EMAIL_REQUEST_TYPES) {

        var profile = {

            restrict: TO += ELEMENTS,
            templateUrl: 'profile.html',
            scope: {
                role: '=?',
                roster: '=?',
                rosterId: '=?',
                positions: '=?',
                player: '=?',
                assistant: '=?',
                options: '=?',
                positionset: '=',
                team: '=?',
                rosterEntry: '='
            },
            replace: true,
            link: function(scope, element, attributes) {
                scope.keys = window.Object.keys;
                scope.users = users.getCollection();
                scope.playersFactory = players;
                scope.usersFactory = users;
                scope.ROLE_TYPE = ROLE_TYPE;
                if (!scope.player.shortName) {
                    players.load(scope.player.id).then(()=> {
                        scope.player = players.get(scope.player.id);
                    });
                }

                scope.getPositions = function() {
                    var playerPositions = [];
                    if (scope.player && scope.player.id) {
                        angular.forEach(scope.positionset.positions, function(value) {
                            angular.forEach(scope.rosterEntry.playerInfo.positionIds, function(id) {
                                if (id === value.id) {
                                    playerPositions.push(value);
                                }
                            });
                        });
                    }
                    return playerPositions;
                };

                scope.resendInvite = function(userId, teamId, player) {
                    player.sendingEmail = true;
                    player.confirmSent = false;
                    users.resendEmail(EMAIL_REQUEST_TYPES.PLAYER_ACTIVATION_REMINDER, {teamId: teamId}, userId);
                    $timeout(function() {
                        player.confirmSent = true;
                    }, 1000);
                    $timeout(function() {
                        player.sendingEmail = false;
                    }, 2500);
                };
            }
        };

        return profile;
    }
]);
