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
    '$window', '$http', '$state', '$rootScope', 'AlertsService', 'ALLOWED_FILE_EXTENSIONS', 'config', 'flowFactory', 'FileUploadService',
    function directive($window, $http, $state, $rootScope, alerts, ALLOWED_FILE_EXTENSIONS, config, flow, FileUploadService) {

        var kvsUploader = {

            restrict: TO += ELEMENTS,
            scope: {
                film: '=',
                modal: '=?'
            },
            templateUrl: 'kvsUploader.html',
            link: link
        };

        function link(scope) {

            scope.flow.on('fileAdded', function flowFileAdded(flowFile, event) {

                let filename = flowFile.file.name;
                let extension = path.extname(filename).toLowerCase();

                if (ALLOWED_FILE_EXTENSIONS.indexOf(extension) < 0) {

                    alerts.add({
                        type: 'danger',
                        message: 'The file "' + filename + '" has an unsupported extension.'
                    });
                    return false;
                }
            });

            scope.upload = () => {

                scope.uploading = true;

                // TODO: If no files, show error message

                requestUploadServerUrl()
                .success((response) => {

                    getGUID(response)
                    .success((data) => {

                        if (!data || data && !data.guid) {

                            scope.uploading = false;
                            throw new Error('No GUID found in response');
                        }

                        /* The GUID from KVS. */
                        let guid = data.guid;

                        /* TODO: Change to use logging framework */
                        console.log('KVS GUID: ' + guid);

                        prepareFilesForUpload(guid, response.url);

                        /* Store the GUID with the game. */
                        scope.film.video = {
                            guid
                        };

                        scope.film.save()
                        .then((data) => {

                            let fileUpload = FileUploadService.getFileUpload(scope.film.video.guid, scope.flow);

                            if (fileUpload) {

                                fileUpload.upload();

                                if (scope.modal) {
                                    scope.modal.close();
                                }

                                $state.go('Games.Info', {id: scope.film.id});

                            } else {

                                alerts.add({
                                    type: 'danger',
                                    message: 'You are uploading too many files. Please wait until some finish in order to upload more'
                                });

                                if (uploadManager.count() < uploadManager.MAX_UPLOADS) {
                                    scope.film.save().then(function() {
                                        scope.flow.upload();
                                        uploadManager.add(scope.film);
                                        if (scope.modal) {
                                            scope.modal.close();
                                        }
                                        $state.go('Games.Info', {id: scope.film.id, isHomeGame: true});
                                    });
                                } else {
                                    alerts.add({
                                        type: 'danger',
                                        message: 'You are uploading too many files. Please wait until some finish in order to upload more'
                                    });
                                }
                            }
                        });

                    })
                    .error(guidRequestFail);

                })
                .error(requestUploadServerUrlFail);
            };

            function getGUID(response) {

                if (!response) throw new Error(`required argument 'response' is undefined`);

                let numberOfFiles = scope.flow.files.length;

                // return promise
                return requestGUID(response.url, numberOfFiles);
            }

            // TODO: Move to kvs upload service in services
            function requestUploadServerUrl () {

                let url = config.api.uri + 'upload-server';

                return $http.get(url);
            }

            // TODO: Move to kvs upload service 'requestGUID(numberOfFiles), maybe create GUID locally'
            function requestGUID(kvsUrl, partCount) {

                let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

                let url = kvsUrl + '/upload';
                let data = 'partCount=' + partCount;
                let options = {headers};

                /* Request a GUID from KVS. */
                return $http.post(url, data, options);
            }

            function guidRequestFail(data) {

                scope.uploading = false;

                console.error('Request for GUID failed');
            }

            function requestUploadServerUrlFail(data) {

                scope.uploading = false;

                console.error('Request for Upload Server URL. Please check your internet connection');
            }

            function prepareFilesForUpload(guid, kvsUrl) {

                /* Files to upload */
                let files = scope.flow.files;

                /* Set the KVS target to include the GUID. */
                scope.flow.opts.target = kvsUrl + '/upload/part/' + guid;

                /* Format the unique identifier for each file. */
                files.forEach(function(file, index, files) {

                    let part = index + 1;

                    /* Determine file extension. */
                    let extension = path.extname(file.name);

                    /* The unique identifier includes the GUID from KVS,
                     * part number, and file extension. */
                    let uniqueIdentifier = guid + '_' + part + extension;
                    files[index].uniqueIdentifier = uniqueIdentifier;
                });
            }
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
