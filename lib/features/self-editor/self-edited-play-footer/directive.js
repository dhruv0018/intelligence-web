import controller from './controller';

const restrict = 'E';

const scope = {
    play: '='
};

const definition = {
    restrict,
    templateUrl: 'lib/features/self-editor/self-edited-play-footer/template.html',
    controller,
    scope
};

export default () => definition;
