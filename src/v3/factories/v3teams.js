const PAGE_SIZE = 1000;
const pkg = require('../../../package.json');
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('v3TeamsFactory', [
    'config',
    '$injector',
    'v3BaseFactory',
    function(
        config,
        $injector,
        v3BaseFactory
    ) {

        const TeamsFactory = {

            PAGE_SIZE,

            description: 'teams',

            model: 'v3TeamsResource',

            extend: function(team){
                let self = this;

                angular.augment(team, self);

                /**
                 * Gets the League for the team if it was included during a fetch
                 *
                 * @returns {object|null}
                 */
                team.getLeague = function () {
                    if (this.includes) {
                        return this.includes.league || null;
                    }

                    return null;
                };

                /**
                 * Gets the School for the team if it was included during a fetch
                 *
                 * @returns {object|null}
                 */
                team.getSchool = function () {
                    if (this.includes) {
                        return this.includes.school || null;
                    }

                    return null;
                };

                return team;
            },

            unextend: function(example){
                let self = this;

                example = example || self;

                let copy = v3BaseFactory.unextend(example);

                return copy;
            }
        };

        angular.augment(TeamsFactory, v3BaseFactory);

        return TeamsFactory;
    }
]);
