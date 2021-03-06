/* Constants */
let TO = '';
const ELEMENTS = 'E';

/* Fetch angular from the browser scope */
let angular = window.angular;

/* Fetch Mousetrap from the browser scope */
const Mousetrap = window.Mousetrap;

/**
 * ButtonVideoStepForward module.
 * @module ButtonVideoStepForward
 */
let ButtonVideoStepForward = angular.module('ButtonVideoStepForward', []);

/**
 * ButtonVideoStepForward dependencies.
 */
buttonVideoStepForwardDirective.$inject = [
    'config',
    '$document',
    '$timeout',
    'VideoPlayer'
];

/**
 * ButtonVideoStepForward directive.
 * @module ButtonVideoStepForward
 * @name ButtonVideoStepForward
 * @type {directive}
 */
function buttonVideoStepForwardDirective (
    config,
    $document,
    $timeout,
    VideoPlayer
) {

    let mediaElement;
    let button;
    let animationFrame;

    const definition = {

        restrict: TO += ELEMENTS,

        require: '^videogular',

        templateUrl: 'lib/directives/video-player/button-video-step-forward/template.html',

        link: link
    };

    function link($scope, element, attributes, videogular) {
        $scope.steppingForward = false;
        // $scope.$apply();
        //FOR DIGEST ERROR http://stackoverflow.com/questions/12729122/angularjs-prevent-error-digest-already-in-progress-when-calling-scope-apply
        $timeout(function(){
            $scope.$apply();
        });
        mediaElement = videogular.mediaElement[0];
        button = element[0];

        button.addEventListener('click', onMouseClick);
        element.on('$destroy', onDestroy);
        if ($scope.userIsIndexer) {
            Mousetrap.bind('right', () => onKeyDown($scope), 'keydown');
            Mousetrap.bind('right', () => onKeyUp($scope), 'keyup');
        }

        function onMouseClick () {
            step();
        }

        function onKeyDown ($scope) {
            $scope.steppingForward = true;
            $scope.$apply();
            step();
        }

        function onKeyUp ($scope) {
            $scope.steppingForward = false;
            $scope.$apply();
        }

        function step () {

            animationFrame = requestAnimationFrame(increment);
        }

        function increment () {

            mediaElement.currentTime += config.videoplayer.stepTime.increment;
        }

        function onDestroy () {

            button.removeEventListener('click', onMouseClick);
        }
    }

    return definition;
}

ButtonVideoStepForward.directive('buttonVideoStepForward', buttonVideoStepForwardDirective);

export default ButtonVideoStepForward;
