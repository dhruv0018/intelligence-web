import controller from './controller';
const restrict = 'E';

const scope = {
    formation: '=',
    formationLabel: '=',
    teamId: '=',
    seasonId: '='
};

const definition = {
    restrict,
    templateUrl: 'lib/directives/formation-label/template.html',
    controller,
    scope
};

export default () => definition;
