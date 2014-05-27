/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * RawFilm page module.
 * @module RawFilm
 */
var RawFilm = angular.module('RawFilm', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
RawFilm.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('raw-film.html', template);
    }
]);

/**
 * RawFilm modal dialog.
 * @module RawFilm
 * @name RawFilm.Modal
 * @type {value}
 */
RawFilm.value('RawFilm.Modal', {

    templateUrl: 'raw-film.html',
    controller: 'RawFilm.controller'
});

/**
 * RawFilm controller.
 * @module RawFilm
 * @name RawFilm.controller
 * @type {controller}
 */
RawFilm.controller('RawFilm.controller', [
    '$scope', '$state', '$modalInstance',
    function controller($scope, $state, $modalInstance) {

    }
]);

