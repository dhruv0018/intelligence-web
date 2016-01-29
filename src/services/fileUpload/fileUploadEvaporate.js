const pkg = require('../../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

var Evaporate = require('evaporate');
var SparkMD5 = require('spark-md5');


/**
 * @class FileUploadEvaporate
 * @description Implements EvaporateJS Uploader.
 */
class EvaporateUploader {

    constructor() {
        this.settings = {};
        this.callbacks = {
            complete: [],
            partial: [],
            progress: [],
            error: [],
            warn: [],
            failedAuth: []
        };
        this.files = [];
        this.progressFiles = [];
        this.uploaders = [];
        this.evaporate = null;
        this.isComplete = false;

    }

    /**
     * Add evaporate settings
     * @param  {[type]} settings [description]
     * @return {[type]}          [description]
     */
    initEvaporate(settings) {
        this.settings = settings;
        if (this.settings.computeContentMd5) {
            this.settings.cryptoMd5Method = function(data) {
                return btoa(SparkMD5.hashBinary(data, true));
            };
        }
    }

    /**
     * Upload Process
     * @return {[type]} [description]
     */
    upload(files) {
        var self = this;
        self.evaporate = new Evaporate(this.settings);

        files.forEach(function(file, index, files) {

            function onComplete(complete, awsKey) {
                file.fileName = awsKey;
                self.progressFiles[index] = 1;
                self.callbacks.partial.forEach(callback => {
                    callback(file);
                });

                if (self.progress() == 1) {
                    self.isComplete = true;
                    self.callbacks.complete.forEach(callback => {
                        callback(file);
                    });
                }
            }

            function onProgress(progress) {
                let currentProgress = progress;
                if (self.progressFiles[index] < currentProgress) {
                    self.progressFiles[index] = currentProgress;
                }
                self.callbacks.progress.forEach(callback => {
                    callback(self.progress());
                });
            }

            function onError() {
                self.callbacks.error.forEach(callback => {
                    callback(file);
                });
            }

            function onWarn() {
                self.callbacks.warn.forEach(callback => {
                    callback(file);
                });
            }

            function onFailedAuth() {
                self.callbacks.failedAuth.forEach(callback => {
                    callback(file);
                });
            }

            self.progressFiles[index] = 0;
            self.uploaders.push(
                self.evaporate.add({
                    name: file.fileName,
                    file: file.file,
                    logging: false,
                    signHeaders: {
                        'Authorization': function() {
                            return 'Bearer ' + self.settings.accessToken();
                        }
                    },
                    complete: onComplete,
                    progress: onProgress,
                    error: onError,
                    warn: onWarn,
                    failedAuth: onFailedAuth
                })
            );
        });
    }

    /**
     * Register callbacks
     *
     * @method     on
     * @param      {<type>}  eventName  { description }
     * @param      {<type>}  callback   { description }
     */
    on(eventName, callback) {
        if (eventName === 'complete') {
            this.callbacks.complete.push(callback);
        }

        if (eventName === 'error') {
            this.callbacks.error.push(callback);
        }

        if (eventName === 'partial') {
            this.callbacks.partial.push(callback);
        }

        if (eventName === 'progress') {
            this.callbacks.progress.push(callback);
        }

        if (eventName === 'warn') {
            this.callbacks.warn.push(callback);
        }

        if (eventName === 'onFailedAuth') {
            this.callbacks.failedAuth.push(callback);
        }
    }

    /**
     * Clean Events
     * @param  {[type]}   eventName [description]
     * @param  {Function} callback  [description]
     * @return {[type]}             [description]
     */
    off(eventName, callback) {
        if (eventName === 'complete') {
            this.callbacks.complete = [];
        }

        if (eventName === 'error') {
            this.callbacks.error = [];
        }

        if (eventName === 'partial') {
            this.callbacks.partial = [];
        }

        if (eventName === 'progress') {
            this.callbacks.progress = [];
        }

        if (eventName === 'warn') {
            this.callbacks.warn = [];
        }
    }

    /**
     * Return total uploads progress
     *
     * @method     progress
     * @return     {number}  { description_of_the_return_value }
     */
    progress() {
        if (this.isComplete) {
            return 1;
        }

        let progress = 0;
        for (let i = 0; i < this.progressFiles.length; i++) {
            progress += this.progressFiles[i];
        }
        if (progress === this.progressFiles.length) {
            return 1;
        }

        progress = Math.round((progress / this.progressFiles.length) * 100) / 100;
        return progress;
    }

    /**
     * Cancel uploaders
     */
    cancel() {
        if (this.evaporate) {
            for (let i = 0; i < this.uploaders.length; i++) {
                this.evaporate.cancel(this.uploaders[i]);
            }
        }
    }

}

/**
 * Service to provide EvaporateUploader instances.
 */
class FileUploadEvaporate {
    createUploader() {
        return new EvaporateUploader();
    }
}

/**
 * @module IntelligenceWebClient
 * @name      FileUploadEvaporate
 * @type     {service}
 */
export default FileUploadEvaporate;
IntelligenceWebClient.service('FileUploadEvaporate', FileUploadEvaporate);
