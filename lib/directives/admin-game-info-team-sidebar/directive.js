import controller from './controller';

const restrict = 'E';

const scope = {
    game: '='
};

const definition = {
    restrict,
    templateUrl: 'lib/directives/admin-game-info-team-sidebar/template.html',
    controller,
    controllerAs: 'adminGameInfoTeamSidebarController',
    scope
};

export default () => definition;
