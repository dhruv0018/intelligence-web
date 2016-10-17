/* Constants */
let TO = '';
const ELEMENTS = 'E';

/* Fetch angular from the browser scope */
let angular = window.angular;

/* Fetch Mousetrap from the browser scope */
const Mousetrap = window.Mousetrap;

/**
 * ButtonVideoNextPlay module.
 * @module ButtonVideoNextPlay
 */
let ButtonVideoNextPlay = angular.module('ButtonVideoNextPlay', []);

/**
 * ButtonVideoNextPlay dependencies.
 */
buttonVideoNextPlay.$inject = [
    'config',
    '$document',
    '$timeout',
    'VideoPlayer',
    'PlayManager',
    'PlaysManager'
];

/**
 * ButtonVideoNextPlay directive.
 * @module ButtonVideoNextPlay
 * @name ButtonVideoNextPlay
 * @type {directive}
 */
function buttonVideoNextPlay (
    config,
    $document,
    $timeout,
    videoPlayer,
    playManager,
    playsManager
) {

    let mediaElement;
    let button;
    let animationFrame;

    const definition = {

        restrict: TO += ELEMENTS,

        require: '^videogular',

        templateUrl: 'lib/directives/video-player/button-video-next-play/template.html',

        link: link
    };

    function link($scope, element, attributes, videogular) {
        $scope.steppingForward = false;

        //FOR DIGEST ERROR http://stackoverflow.com/questions/12729122/angularjs-prevent-error-digest-already-in-progress-when-calling-scope-apply
        $timeout(function(){
            $scope.$apply();
        });
        mediaElement = videogular.mediaElement[0];
        button = element[0];

        button.addEventListener('click', onMouseClick);
        element.on('$destroy', onDestroy);
    }

    function onMouseClick () {
        let wasPlaying = videoPlayer.currentState === 'play';
        let play = playsManager.getNextPlay(playManager.current);

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

ButtonVideoNextPlay.directive('buttonVideoNextPlay', buttonVideoNextPlay);

export default ButtonVideoNextPlay;
