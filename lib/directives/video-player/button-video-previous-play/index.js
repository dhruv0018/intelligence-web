/* Constants */
let TO = '';
const ELEMENTS = 'E';

/* Fetch angular from the browser scope */
let angular = window.angular;

/* Fetch Mousetrap from the browser scope */
const Mousetrap = window.Mousetrap;

/**
 * ButtonVideoPreviousPlay module.
 * @module ButtonVideoPreviousPlay
 */
let ButtonVideoPreviousPlay = angular.module('ButtonVideoPreviousPlay', []);

/**
 * ButtonVideoPreviousPlay dependencies.
 */
buttonVideoPreviousPlay.$inject = [
    'config',
    '$document',
    '$timeout',
    'VideoPlayer',
    'PlayManager',
    'PlaysManager'
];

/**
 * ButtonVideoPreviousPlay directive.
 * @module ButtonVideoPreviousPlay
 * @name ButtonVideoPreviousPlay
 * @type {directive}
 */
function buttonVideoPreviousPlay (
    config,
    $document,
    $timeout,
    videoPlayer,
    playManager,
    playsManager
) {

    let button;

    const definition = {

        restrict: TO += ELEMENTS,

        require: '^videogular',

        templateUrl: 'lib/directives/video-player/button-video-previous-play/template.html',

        link: link
    };

    function link($scope, element, attributes, videogular) {

        //FOR DIGEST ERROR http://stackoverflow.com/questions/12729122/angularjs-prevent-error-digest-already-in-progress-when-calling-scope-apply
        $timeout(function(){
            $scope.$apply();
        });

        button = element[0];
        button.addEventListener('click', onMouseClick);
        element.on('$destroy', onDestroy);
    }

    function onMouseClick () {
        let wasPlaying = videoPlayer.currentState === 'play';
        let play = playsManager.getPreviousPlay(playManager.current);

        if(play!=null) {
            /* Set the current play. */
            playManager.current = play;

            videoPlayer.setVideo(play.clip).then(function () {
                videoPlayer.seekTime(0);

                if (wasPlaying) videoPlayer.play();
            });
        }
    }

    function onDestroy () {

        button.removeEventListener('click', onMouseClick);
    }

    return definition;
}

ButtonVideoPreviousPlay.directive('buttonVideoPreviousPlay', buttonVideoPreviousPlay);

export default ButtonVideoPreviousPlay;
