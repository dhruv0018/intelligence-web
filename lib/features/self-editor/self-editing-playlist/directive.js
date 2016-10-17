import controller from './controller';

const restrict = 'E';

/**
 * @param game Game Factory Resource
 * @param playList playList is a core src collection that has a list of selfEditedPlays
 * @param currentSelfEditorState The states are either BREAKDOWN_STATE or EDITOR_STATE
 */
const scope = {
    game: '=',
    playList: '=',
    filteredPlayList: '=',
    currentSelfEditorState: '=',
    hideEditingOptions: '='
};

const definition = {
    restrict,
    templateUrl: 'lib/features/self-editor/self-editing-playlist/template.html',
    controller,
    scope
};

export default () => definition;
