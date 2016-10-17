/*globals require*/
/* Constants */
let TO = '';
const ELEMENTS = 'E';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Uploader
 * @module Uploader
 */
const Uploader = angular.module('uploader', [
    'ui.router',
    'ui.bootstrap',
    'ngMaterial',
    'ngMdIcons'
]);

/**
 * Uploader directive.
 * @module Uploader
 * @name krossoverUploader
 * @type {Directive}
 */
Uploader.directive('krossoverUploader', [
    '$state',
    function directive($state) {

        var uploader = {

            restrict: TO += ELEMENTS,
            templateUrl: 'lib/directives/uploader/template.html',
            replace: true,
            scope: {
                'noFile': '=',
                'uploadLabel': '@',
                'onUpload': '&',
                'id': '@?'
            },
            link: function(scope, element, attrs) {
            }
        };

        return uploader;
    }
]);

export default Uploader;
