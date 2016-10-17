import controller from './controller';

const restrict = 'E';

const scope = {
    plays: '=',
    game: '='
};

const definition = {
    restrict,
    templateUrl: 'lib/features/self-editor/self-edited-plays-filters/template.html',
    controller,
    scope
};

export default () => definition;
