// import locals
import SELF_EDITOR_STATES from './constants.js';
// import core libraries
import PlayList from '../../../src/collections/playList';

SelfEditorController.$inject = [
    '$rootScope',
    '$scope',
    'GamesFactory',
    'TeamsFactory',
    'SelfEditedPlaysFactory',
    'SelfEditedPlayControlsModeNotifier'
];

function SelfEditorController (
    $rootScope,
    $scope,
    games,
    teams,
    selfEditedPlays,
    selfEditedPlayControlsModeNotifier
) {
    this.BREAKDOWN_STATE = SELF_EDITOR_STATES.BREAKDOWN;
    this.EDITOR_STATE = SELF_EDITOR_STATES.EDITOR;
    this.CURRENT_SELF_EDITOR_STATE = SELF_EDITOR_STATES.BREAKDOWN;

    this.team = teams.get(this.game.teamId);
    this.opposingTeam = teams.get(this.game.opposingTeamId);
    this.video = this.game.video;
    this.cuePoints = [];
    this.posterImage = {
        url: this.game.video.thumbnail
    };

    this.isEditModeEnabled = false;

    let selfEditorPlays = selfEditedPlays.getList({gameId: this.game.id});
    // create a PlayList collection from the selfEditorPlays to pass into self-editing-playlist directive
    this.playList = new PlayList(selfEditorPlays);

    $scope.selfEditedPlays = selfEditorPlays;
    $scope.game = this.game;
    $scope.filteredPlayList = new PlayList(this.playList.identity);

    this.toggleSelfEditorState = function() {

        if (this.CURRENT_SELF_EDITOR_STATE === SELF_EDITOR_STATES.BREAKDOWN) {
            this.CURRENT_SELF_EDITOR_STATE = SELF_EDITOR_STATES.EDITOR;
            selfEditedPlayControlsModeNotifier.notifyResetToEditorMode();
            this.hideHeaders = true;
        } else if (this.CURRENT_SELF_EDITOR_STATE === SELF_EDITOR_STATES.EDITOR) {
            this.cuePoints = [];
            this.CURRENT_SELF_EDITOR_STATE = SELF_EDITOR_STATES.BREAKDOWN;
            selfEditedPlayControlsModeNotifier.notifyResetToDefaultMode();
            this.hideHeaders = false;
            $rootScope.$broadcast('self-edited-play-state-notifier-did-create-finish-clear');
        }
    };


    // Listeners from self-edited-play-state-notifier

    $rootScope.$on('self-edited-play-state-notifier-did-delete', (event, play) => {
        // remove the deleted play from the playList
        this.playList.remove(play);
    });

    $rootScope.$on('self-edited-play-state-notifier-did-create', (event, play) => {
        // add a newly created play to the playList
        this.playList.add(play);
    });

    // Listerners from self-edited-play-controls-mode-notifier

    $rootScope.$on('self-edited-play-controls-enable-edit-mode', (event, play) => {
        this.isEditModeEnabled = true;
    });

    $rootScope.$on('self-edited-play-controls-disable-edit-mode', (event, play) => {
        this.isEditModeEnabled = false;
    });
}

export default SelfEditorController;
