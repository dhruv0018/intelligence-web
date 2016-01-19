var path = require('path');

/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * s3Uploader
 * @module s3Uploader
 */
var s3Uploader = angular.module('s3Uploader', []);

/* Cache the template file */
s3Uploader.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('s3Uploader.html', template);
    }
]);

/**
 * s3Uploader directive.
 * @module s3Uploader
 * @name s3Uploader
 * @type {Directive}
 */
s3Uploader.directive('s3Uploader', [
    '$window', '$http', '$state', '$rootScope', 'AlertsService', 'ALLOWED_FILE_EXTENSIONS', 'config', 'TeamsFactory', 'FileUploadService', 'FileUploadEvaporate', 'TokensService',
    function directive($window, $http, $state, $rootScope, alerts, ALLOWED_FILE_EXTENSIONS, config, teams, FileUploadService, FileUploadEvaporate, TokensService) {

        var s3Uploader = {

            restrict: TO += ELEMENTS,
            scope: {
                film: '=',
                modal: '=?'
            },
            templateUrl: 's3Uploader.html',
            link: link
        };

        function link(scope) {

            scope.files = [];
            scope.uploading = false;
            scope.config = config;
            scope.uploader = FileUploadEvaporate.createUploader();
            scope.allowedFileExtensions = ALLOWED_FILE_EXTENSIONS.join(',');

            scope.removeFile = function(index) {
                scope.files.splice(index, 1);
            };

            /**
             * Validate rules to verify if submission is ready.
             *
             * @method     isReadyToSubmit
             */
            scope.isReadyToSubmit = function() {
                return scope.files.length > 0 && !scope.uploading;
            };

            /**
             * Upload process
             */
            scope.upload = function() {

                scope.uploading = true;
                requestGUID(config.api.uri + 'upload', scope.files.length)
                    .then(function(response) {
                        scope.uploader.initEvaporate({
                            'signerUrl': config.api.uri + 'file-sign-auth',
                            'aws_key': response.data.awsKey,
                            'bucket': response.data.rawBucket,
                            'accessToken': function() {
                                return TokensService.getAccessToken();
                            },
                            'logging': false,
                            'computeContentMd5': true
                        });
                        /* The GUID from KVS. */
                        let guid = response.data.guid;
                        prepareFilesForUpload(guid);

                        /* Store the GUID with the game. */
                        scope.film.video = {
                            guid
                        };

                        // Infer the game's priorty from the uploader team
                        const team = teams.get(scope.film.uploaderTeamId);
                        if (team) {
                            scope.film.priority = team.priority;
                        }


                        scope.film.save()
                            .then(function() {
                                let fileUpload = FileUploadService.getFileUpload(scope.film.video.guid, scope.uploader);

                                if (scope.modal) {
                                    scope.modal.close();
                                }

                                scope.files.forEach(function(file, index, files) {
                                    fileUpload.addFile(file, file.uniqueIdentifier);
                                });

                                fileUpload.onFailedAuth(function() {
                                    TokensService.refreshToken();
                                });

                                fileUpload.onPartial(function(result) {
                                    var partUrl = config.api.uri + 'upload/part/' + guid;
                                    var postData = 'identifier=' + result.fileName;
                                    var options = {
                                        headers: {
                                            'Content-Type': 'application/x-www-form-urlencoded',
                                            'Authorization': 'Bearer ' + TokensService.getAccessToken()
                                        }
                                    };

                                    $http
                                        .post(partUrl, postData, options)
                                        .then(null, function() {
                                            scope.uploading = false;
                                            // If fails once try to refresh the token
                                            TokensService
                                                .refreshToken()
                                                .then(function() {
                                                    options = {
                                                        headers: {
                                                            'Content-Type': 'application/x-www-form-urlencoded',
                                                            'Authorization': 'Bearer ' + TokensService.getAccessToken()
                                                        }
                                                    };

                                                    $http.post(partUrl, postData, options);

                                                });

                                        });


                                });

                                fileUpload.upload();

                                $state.go('Games.Info', {
                                    id: scope.film.id
                                });

                            });

                    });
            };


            // TODO: Move to kvs upload service 'requestGUID(numberOfFiles), maybe create GUID locally'
            function requestGUID(url, partCount) {

                let headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + TokensService.getAccessToken()
                };

                let data = 'partCount=' + partCount;
                let options = {
                    headers
                };

                /* Request a GUID from KVS. */
                return $http.post(url, data, options);
            }

            function guidRequestFail(data) {

                scope.uploading = false;

                console.error('Request for GUID failed');
            }

            function prepareFilesForUpload(guid) {

                /* Files to upload */
                let files = scope.files;

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

        return s3Uploader;
    }
]);

s3Uploader.filter('bytes', function() {

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
