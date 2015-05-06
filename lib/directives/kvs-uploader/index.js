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
    '$window', '$http', '$state', '$rootScope', 'AlertsService', 'ALLOWED_FILE_EXTENSIONS', 'config', 'flowFactory', 'uploadManager',
    function directive($window, $http, $state, $rootScope, alerts, ALLOWED_FILE_EXTENSIONS, config, flow, uploadManager) {

        var kvsUploader = {

            restrict: TO += ELEMENTS,
            scope: {
                film: '=',
                modal: '=?'
            },
            templateUrl: 'kvsUploader.html',
            link: link
        };

        function link(scope, element, attributes, controller) {
            scope.film.flow = scope.flow;
            scope.flow.on('fileAdded', function(flowFile, event) {
                var filename = flowFile.file.name;
                var extension = path.extname(filename).toLowerCase();

                if (ALLOWED_FILE_EXTENSIONS.indexOf(extension) < 0) {

                    alerts.add({
                        type: 'danger',
                        message: 'The file "' + filename + '" has an unsupported extension.'
                    });
                    return false;
                }
            });

            scope.flow.on('complete', function() {
                uploadManager.remove(scope.film);
            });

            scope.requestUrl = function() {
                var url = config.api.uri + 'upload-server';
                var requestedUrl = $http.get(url);

                requestedUrl.error(function() {
                    scope.uploading = false;
                    throw new Error('Request for KVS URL failed');
                });

                return requestedUrl;
            };

            scope.sortOrder = scope.flow.files;

            scope.upload = function() {

                scope.uploading = true;

                alerts.clear();
                scope.requestUrl().success(function(response) {
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

                                /* Format the unique identifier for each file. */
                                files.forEach(function(file, index, files) {

                                    var part = index + 1;

                                    /* Determine file extension. */
                                    var extension = path.extname(file.name);

                                    /* The unique identifier includes the GUID from KVS,
                                     * part number, and file extension. */
                                    files[index].uniqueIdentifier = guid + '_' + part + extension;
                                });

                                if (uploadManager.count() < uploadManager.MAX_UPLOADS) {
                                    scope.film.save().then(function() {
                                        scope.flow.upload();
                                        uploadManager.add(scope.film);
                                        if (scope.modal) {
                                            scope.modal.close();
                                        }
                                        $state.go('Games.Info', {id: scope.film.id});
                                    });
                                } else {
                                    alerts.add({
                                        type: 'danger',
                                        message: 'You are uploading too many files. Please wait until some finish in order to upload more'
                                    });
                                }

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
                });
            };

            $window.onbeforeunload = function beforeunloadHandler() {

                if (uploadManager.hasRunningUploads()) {
                    return 'Video still uploading! Are you sure you want to close the page and cancel the upload?';
                }

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

kvsUploader.service('uploadManager', [
    function() {
        var uploads = {};

        return {
            MAX_UPLOADS: 100,
            get: function(id) {
                return uploads[id];
            },
            add: function(film) {
                uploads[film.id] = film.flow;
            },
            remove: function(film) {
                delete uploads[film.id];
            },
            print: function() {
                console.log(uploads);
            },
            count: function() {
                return Object.keys(uploads).length;
            },
            pause: function() {
                Object.keys(uploads).forEach(function(filmKey) {
                    uploads[filmKey].pause();
                });
            },
            resume: function() {
                Object.keys(uploads).forEach(function(filmKey) {
                    uploads[filmKey].resume();
                });
            },
            hasRunningUploads: function() {
                return this.count() >  0;
            }
        };
    }
]);
