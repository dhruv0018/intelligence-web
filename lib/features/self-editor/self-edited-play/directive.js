import controller from './controller';

const restrict = 'E';

const scope = {
    play: '=',
    video: '=',
    showStateActions: '=',
    playSelectedForEditing: '='
};

const definition = {
    restrict,
    templateUrl: 'lib/features/self-editor/self-edited-play/template.html',
    controller,
    scope
};

export default () => definition;
