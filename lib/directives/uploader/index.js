/*globals require*/
/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Uploader
 * @module Uploader
 */
var Uploader = angular.module('uploader', [
    'ui.router',
    'ui.bootstrap',
    'ngMaterial',
    'ngMdIcons'
]);

/* Cache the template file */
Uploader.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('uploader.html', require('./template.html'));
    }
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
            templateUrl: 'uploader.html',
            replace: true,
            scope: {
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
