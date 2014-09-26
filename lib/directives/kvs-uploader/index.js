var path = require('path');

/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * kvsUploader
 * @module kvsUploader
 */
var kvsUploader = angular.module('kvsUploader', []);

/* Cache the template file */
kvsUploader.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('kvsUploader.html', template);
    }
]);

/**
 * kvsUploader directive.
 * @module kvsUploader
 * @name kvsUploader
 * @type {Directive}
 */
kvsUploader.directive('kvsUploader', [
    '$http', '$state', '$rootScope', 'AlertsService', 'ALLOWED_FILE_EXTENSIONS', 'config',
    function directive($http, $state, $rootScope, alerts, ALLOWED_FILE_EXTENSIONS, config) {

        var kvsUploader = {

            restrict: TO += ELEMENTS,
            scope: {
                film: '=',
                flow: '='
            },
            templateUrl: 'kvsUploader.html',
            link: link
        };

        function link(scope, element, attributes, controller) {
            console.log(scope.film);
            console.log(scope.film.flow);
            console.log(scope.flow);

            scope.$on('flow::fileAdded', function(event, flow, flowFile) {

                /* Check the if the file extension is allowed. */

                var filename = flowFile.file.name;
                var extension = path.extname(filename).toLowerCase();

                if (!~ALLOWED_FILE_EXTENSIONS.indexOf(extension)) {

                    event.preventDefault();

                    alerts.add({
                        type: 'danger',
                        message: 'The file "' + filename + '" has an unsupported extension.'
                    });
                }
            });

            scope.upload = function() {

                scope.uploading = true;

                alerts.clear();

                var url = config.api.uri + 'upload-server';

                /* Request the upload URL for KVS. */
                $http.get(url)

                    .success(function(response) {

                        /* Get KVS url from the response. */
                        var kvsUrl = response.url;

                        var files = scope.flow.files;
                        var partCount = files.length;
                        var url = kvsUrl + '/upload';
                        var headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
                        var data = 'partCount=' + partCount;
                        var options = { headers: headers };

                        /* Request a GUID from KVS. */
                        $http.post(url, data, options)

                            .success(function(data) {

                                if (data && data.guid) {
                                    console.log('got the video');

                                    /* The GUID from KVS. */
                                    var guid = data.guid;

                                    /* TODO: Change to use logging framework */
                                    console.log('KVS GUID: ' + guid);

                                    /* Store the GUID with the game. */
                                    scope.film.video = {
                                        guid: guid
                                    };

                                    /* Set the KVS target to include the GUID. */
                                    scope.flow.opts.target = kvsUrl + '/upload/part/' + guid;
                                    console.log(scope.flow);
                                    /* Format the unique identifier for each file. */
                                    files.forEach(function(file, index, files) {

                                        var part = index + 1;

                                        /* Determine file extension. */
                                        var extension = path.extname(file.name);

                                        /* The unique identifier includes the GUID from KVS,
                                         * part number, and file extension. */
                                        files[index].uniqueIdentifier = guid + '_' + part + extension;
                                    });

                                    scope.flow.upload();

                                    $state.go('uploading-film');
                                }

                                else {

                                    scope.uploading = false;

                                    throw new Error('No GUID found in response');
                                }
                            })

                            .error(function() {

                                scope.uploading = false;

                                throw new Error('Request for GUID failed');
                            });
                    })

                    .error(function() {

                        scope.uploading = false;

                        throw new Error('Request for KVS URL failed');
                    });
            };
        }

        return kvsUploader;
    }
]);

kvsUploader.filter('bytes', function() {

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
