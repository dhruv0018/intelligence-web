import controller from './controller';

const restrict = 'E';

const scope = {
    team: '=',
    game: '=',
    cuePoints: '='
};

const definition = {
    restrict,
    templateUrl: 'lib/features/self-editor/self-editing-controls/template.html',
    controller,
    scope
};

export default () => definition;
