/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Indexing page module.
 * @module Indexing
 */
var Indexing = angular.module('indexing');

/**
 * @module Indexing
 * @name PlayService
 * @type {service}
 */
Indexing.service('indexing.PlayService', [
    '$modal', 'AlertsService', 'PlaysFactory', 'IndexingService', 'indexing.TagsService',
    function service($modal, alerts, plays, indexing, tags) {

        var model = {

            gameId: indexing.game.id,
            events: []
        };

        this.current = angular.copy(model);
        indexing.plays.push(this.current);

        /**
         * Creates a play.
         */
        this.create = function() {

            this.current = angular.copy(model);
            indexing.plays.push(this.current);
        };

        /**
         * Saves a play.
         */
        this.save = function() {

            var self = this;

            var play = this.current;
            var playIndex = indexing.plays.indexOf(play);

            plays.save(play).then(

                function success(play) {

                    indexing.plays[playIndex] = play;
                },

                function error() {

                    alerts.add({

                        type: 'danger',
                        message: 'Failed to save play'
                    });
                }
            );
        };

        /**
         * Removes a play.
         * @param {Object} play - play to be removed.
         */
        this.remove = function(play) {

            /* If the play has been saved before, also remove it remotely. */
            if (play.id) {

                plays.remove(play).then(

                    function success() {

                        /* Remove play from plays list. */
                        indexing.plays.splice(indexing.plays.indexOf(play), 1);
                    },

                    function error() {

                        alerts.add({

                            type: 'danger',
                            message: 'Failed to delete play'
                        });
                    }
                );

            } else {

                /* Remove play from plays list. */
                indexing.plays.splice(indexing.plays.indexOf(play), 1);
            }

            /* If the deleted play is the current play. */
            if (angular.equals(play, this.current)) {

                /* Create a new play to use as the current one. */
                this.create();
            }
        };
    }
]);

