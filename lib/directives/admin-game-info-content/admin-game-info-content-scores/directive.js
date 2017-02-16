import controller from './controller';

const restrict = 'E';

const scope = {
    game: '='
};

const definition = {
    restrict,
    templateUrl: 'lib/directives/admin-game-info-content/admin-game-info-content-scores/template.html',
    controller,
    controllerAs: 'adminGameInfoContentScoresController',
    scope
};

export default () => definition;
