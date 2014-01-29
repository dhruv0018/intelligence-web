var path = require('path');
var request = require('superagent');

/* Component settings */
var templateUrl = 'coach/add-film/upload.html';

/* Component resources */
var template = require('./upload.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Upload film page module.
 * @module UploadFilm
 */
var UploadFilm = angular.module('upload-film', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
UploadFilm.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Upload film page state router.
 * @module UploadFilm
 * @type {UI-Router}
 */
UploadFilm.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var uploadFilm = {
            name: 'upload-film',
            parent: 'add-film',
            url: '',
            views: {
                'content@add-film': {
                    templateUrl: 'coach/add-film/upload.html',
                    controller: 'UploadFilmController'
                }
            }
        };

        $stateProvider.state(uploadFilm);
    }
]);

UploadFilm.filter('bytes', function() {

    return function(bytes, precision) {

        var KILOBYTE = 1024;
        var units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

        /* Non-processable values return a not available string. */
        if (bytes === 0) return 'N/A';
        if (isNaN(parseFloat(bytes))) return 'N/A';
        if (!isFinite(bytes)) return 'N/A';

        /* Default to one decimal precision. */
        if (typeof precision === 'undefined') precision = 1;

        /* Calculate the power to the kilobyte. */
        var power = Math.floor(Math.log(bytes) / Math.log(KILOBYTE));

        /* Calculate the kilobyte order of magnitude. */
        var kilobytes = Math.pow(KILOBYTE, power);

        /* Calculate the value in kilobytes. */
        var value = bytes / kilobytes;

        /* Round the value to a given precision. */
        var rounded = value.toFixed(precision);

        /* Set the unit using the power. */
        var unit = units[power];

        /* Return the formatted value. */
        return rounded + ' ' + unit;
    };
});

/**
 * UploadFilm controller.
 * @module UploadFilm
 * @name UploadFilmController
 * @type {Controller}
 */
UploadFilm.controller('UploadFilmController', [
    'config', 'ALLOWED_FILE_EXTENSIONS', '$rootScope', '$scope', '$state', '$localStorage', 'SessionService', 'GamesFactory',
    function controller(config, ALLOWED_FILE_EXTENSIONS, $rootScope, $scope, $state, $localStorage, session, games) {

        $scope.$storage = $localStorage;

        $scope.$storage.game = {};
        delete $scope.$storage.opposingTeam;

        $scope.upload = function() {

            $scope.$flow.resume();
            $state.go('game-info');
        };

        $scope.$on('flow::fileAdded', function (event, $flow, flowFile) {

            /* Check the if the file extension is allows. */

            var filename = flowFile.file.name;
            var extension = path.extname(filename).toLowerCase();

            if (!~ALLOWED_FILE_EXTENSIONS.indexOf(extension)) {

                event.preventDefault();

                $rootScope.$broadcast('alert', {

                    type: 'danger',
                    message: 'The file "' + filename + '" has an unsupported extension.'
                });
            }
        });

        $scope.$on('flow::uploadStart', function (event, $flow) {

            var files = $flow.files;
            var length = files.length;
            var partCount = length + 1;

            var data = {

                'partCount': partCount
            };

            /* Request a GUID from KVS. */
            request
            .post(config.kvs.uri + 'upload')
            .type('form')
            .send(data)
            .end(function(response) {

                /* If there is a GUID in the response the use it. */
                if(response.ok && response.body && response.body.guid) {

                    var part = 1;  // Part numbers are arbitrary, but must increment.
                    var extension;

                    /* The GUID from KVS. */
                    var guid = response.body.guid;

                    $scope.$apply(function() {

                        /* Store the GUID with the game. */
                        $scope.$storage.game.guid = guid;

                        /* Adjust the KVS target to include the GUID. */
                        $flow.opts.target += guid;

                        /* Format the unique identifier for each file. */
                        files.forEach(function(file, index, files) {

                            /* Determine file extension. */
                            extension = path.extname(file.name);

                            /* The unique identifier includes the GUID from KVS,
                             * part number, and file extension. */
                            files[index].uniqueIdentifier = guid + '_' + part + extension;

                            /* Increment the part number. */
                            part++;
                        });
                    });

                /* Otherwise; there was a problem with the response. */
                } else {

                    $rootScope.$broadcast('alert', {

                        type: 'danger',
                        message: 'There was a problem with your upload'
                    });

                    throw new Error('Request for GUID failed');
                }
            });
        });
    }
]);

