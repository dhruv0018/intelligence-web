const pkg = require('../../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

/**
 * @module IntelligenceWebClient
 * @name uploadManager
 * @type {service}
 */
IntelligenceWebClient.service('uploadManager', [
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
