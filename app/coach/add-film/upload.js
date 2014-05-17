var path = require('path');

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
    'config', 'ALLOWED_FILE_EXTENSIONS', '$rootScope', '$scope', '$state', '$localStorage', '$http', 'AlertsService', 'SessionService', 'GamesFactory',
    function controller(config, ALLOWED_FILE_EXTENSIONS, $rootScope, $scope, $state, $localStorage, $http, alerts, session, games) {

        $scope.$storage = $localStorage;

        $scope.$storage.game = {};
        delete $scope.$storage.opposingTeam;

        $scope.$on('flow::fileAdded', function(event, $flow, flowFile) {

            /* Check the if the file extension is allowed. */

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

        $scope.upload = function() {

            $scope.uploading = true;

            alerts.clear();

            var files = $scope.$flow.files;
            var partCount = files.length;
            var url = config.kvs.uri + 'upload';
            var headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
            var data = 'partCount=' + partCount;
            var options = { headers: headers };

            /* Request a GUID from KVS. */
            $http.post(url, data, options)

            .success(function(data) {

                if (data && data.guid) {

                    /* The GUID from KVS. */
                    var guid = data.guid;

                    /* TODO: Change to use logging framework */
                    console.log('KVS GUID: ' + guid);

                    /* Create video object on the game. */
                    $scope.$storage.game.video = {

                        /* Store the GUID with the game. */
                        guid: guid
                    };

                    /* Set the KVS target to include the GUID. */
                    $scope.$flow.opts.target = config.kvs.uri + 'upload/part/' + guid;

                    /* Format the unique identifier for each file. */
                    files.forEach(function(file, index, files) {

                        var part = index + 1;

                        /* Determine file extension. */
                        var extension = path.extname(file.name);

                        /* The unique identifier includes the GUID from KVS,
                         * part number, and file extension. */
                        files[index].uniqueIdentifier = guid + '_' + part + extension;
                    });

                    $scope.$flow.upload();

                    $state.go('game-info');
                }

                else {

                    $scope.uploading = false;

                    throw new Error('No GUID found in response');
                }
            })

            .error(function() {

                $scope.uploading = false;

                throw new Error('Request for GUID failed');
            });
        };
    }
]);

