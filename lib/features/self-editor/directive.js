import controller from './controller';

const restrict = 'E';

const scope = {
    hideHeaders: '=',
    hideEditingOptions: '=',
    game: '='
};

const definition = {
    restrict,
    templateUrl: 'lib/features/self-editor/template.html',
    controller,
    controllerAs: 'ctrl',
    bindToController: true,
    scope
};

export default () => definition;
