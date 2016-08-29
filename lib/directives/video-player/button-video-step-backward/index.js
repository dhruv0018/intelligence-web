/* Constants */
let TO = '';
const ELEMENTS = 'E';

/* Fetch angular from the browser scope */
let angular = window.angular;

/* Template */
const template = require('./template.html');

/* Fetch Mousetrap from the browser scope */
const Mousetrap = window.Mousetrap;

/**
 * ButtonVideoStepBackward module.
 * @module ButtonVideoStepBackward
 */
let ButtonVideoStepBackward = angular.module('ButtonVideoStepBackward', []);

/**
 * ButtonVideoStepBackward dependencies.
 */
buttonVideoStepBackward.$inject = [
    'config',
    '$document',
    '$timeout',
    'VideoPlayer'
];

/**
 * ButtonVideoStepBackward directive.
 * @module ButtonVideoStepBackward
 * @name ButtonVideoStepBackward
 * @type {directive}
 */
function buttonVideoStepBackward (
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

        template: template,

        link: link
    };

    function link($scope, element, attributes, videogular) {
        $scope.steppingBackward = false;
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
            Mousetrap.bind('left', () => onKeyDown($scope), 'keydown');
            Mousetrap.bind('left', () => onKeyUp($scope), 'keyup');
        }
    }

    function onMouseClick () {
        step();
    }

    function onKeyDown ($scope) {
        $scope.steppingBackward = true;
        $scope.$apply();
        step();
    }

    function onKeyUp ($scope) {
        $scope.steppingBackward = false;
        $scope.$apply();
    }

    function step () {

        animationFrame = requestAnimationFrame(increment);
    }

    function increment () {

        mediaElement.currentTime -= config.videoplayer.stepTime.increment;
    }

    function onDestroy () {

        button.removeEventListener('click', onMouseClick);
    }

    return definition;
}

ButtonVideoStepBackward.directive('buttonVideoStepBackward', buttonVideoStepBackward);
