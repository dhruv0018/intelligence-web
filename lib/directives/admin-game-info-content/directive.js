import controller from './controller';

const restrict = 'E';

const scope = {
    game: '='
};

const definition = {
    restrict,
    templateUrl: 'lib/directives/admin-game-info-content/template.html',
    controller,
    controllerAs: 'adminGameInfoContentController',
    scope
};

export default () => definition;
