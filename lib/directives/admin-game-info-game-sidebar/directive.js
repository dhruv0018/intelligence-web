import controller from './controller';

const restrict = 'E';

const scope = {
    game: '='
};

const definition = {
    restrict,
    templateUrl: 'lib/directives/admin-game-info-game-sidebar/template.html',
    controller,
    controllerAs: 'adminGameInfoGameSidebarController',
    scope
};

export default () => definition;
