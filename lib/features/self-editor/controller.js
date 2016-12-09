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
    'SelfEditedPlayControlsModeNotifier',
    'SelfEditedPlayStateNotifier',
    'VideoPlayer',
    '$window',
    'SessionService',
    'TELESTRATION_PERMISSIONS',
    'VIDEO_PLAYER_EVENTS',
    'VideoPlayerEventEmitter',
    '$timeout'
];

function SelfEditorController (
    $rootScope,
    $scope,
    games,
    teams,
    selfEditedPlays,
    selfEditedPlayControlsModeNotifier,
    selfEditedPlayStateNotifier,
    videoPlayer,
    $window,
    session,
    TELESTRATION_PERMISSIONS,
    VIDEO_PLAYER_EVENTS,
    VideoPlayerEventEmitter,
    $timeout
) {
    this.BREAKDOWN_STATE = SELF_EDITOR_STATES.BREAKDOWN;
    this.EDITOR_STATE = SELF_EDITOR_STATES.EDITOR;
    this.CURRENT_SELF_EDITOR_STATE = SELF_EDITOR_STATES.BREAKDOWN;

    if (this.game.teamId) this.team = teams.get(this.game.teamId);
    if (this.game.opposingTeamId) this.opposingTeam = teams.get(this.game.opposingTeamId);
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
    $scope.telestrationsPermissions = this.hideEditingOptions ? TELESTRATION_PERMISSIONS.VIEW : TELESTRATION_PERMISSIONS.EDIT;
    $scope.telestrations = $scope.game.selfEditedTelestrations;

    this.cuePoints = $scope.telestrations.getTelestrationCuePoints();

    this.toggleSelfEditorState = function() {

        this.cuePoints = $scope.telestrations.getTelestrationCuePoints();
        if (this.CURRENT_SELF_EDITOR_STATE === SELF_EDITOR_STATES.BREAKDOWN) {
            this.CURRENT_SELF_EDITOR_STATE = SELF_EDITOR_STATES.EDITOR;
            selfEditedPlayControlsModeNotifier.notifyResetToEditorMode();
            this.hideHeaders = true;
        } else if (this.CURRENT_SELF_EDITOR_STATE === SELF_EDITOR_STATES.EDITOR) {
            this.CURRENT_SELF_EDITOR_STATE = SELF_EDITOR_STATES.BREAKDOWN;
            selfEditedPlayControlsModeNotifier.notifyResetToDefaultMode();
            this.hideHeaders = false;
            selfEditedPlayStateNotifier.notifyDidCreateFinishClear();
            videoPlayer.pause();
        }
    };

    this.isBreakDownAvailable = function () {
        return  (session.currentUser.remainingBreakdowns &&
            (session.currentUser.remainingBreakdowns.planGamesRemaining ||
                session.currentUser.remainingBreakdowns.packageGamesRemaining));
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

    // Listerners from self-edited telestrations update

    $rootScope.$on('telestrations:updated', () => {
        this.cuePoints = $scope.telestrations.getTelestrationCuePoints();
    });

    $rootScope.$on('telestrations:save', (event, callbackFn) => {
        callbackFn = callbackFn || angular.noop;
        // Save Game
        $scope.game.save(null, null, null, true).then(function onSaved() {
            callbackFn();
        });
    });

    /**
     * When the film editor (self editor) changes between editing and non-editing modes,
     * the size of the container holding the player changes.  If we go from non-editing to editing,
     * it is possible that the video player resized to the larger container size and would still retain
     * that size when back to editing mode, causing some of the player to be offscreen.
     *
     * Trigger a resize of the video player when changing self editor state
     */
    $scope.$watch('ctrl.CURRENT_SELF_EDITOR_STATE',function() {
        console.log("Found change in edit mode!");
        $timeout(function resize() {
            VideoPlayerEventEmitter.emit(VIDEO_PLAYER_EVENTS.RESIZE);
        });
    });
}

export default SelfEditorController;
