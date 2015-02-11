var Telestration = angular.module('Telestration');

/**
 * Telestration factory
 * @module Telestration
 * @name TelestrationFactory
 * @type {factory}
 */
module.exports = [
    function() {

        function Telestration(gameId, time, playId) {

            if (!gameId) throw new Error('telestration object requires gameId');
            if (!time) throw new Error('telestration object requires time');

            this.gameId = gameId;
            this.time = time;
            this.glyphs = [];

            if (playId) this.playId = playId; // TODO: Make playId required for playTelestration
        }

        Telestration.prototype.addGlyph = function addGlyph(glyph) {
            if (glyph) this.glyphs.push(glyph);
        };

        Telestration.prototype.popGlyph = function popGlyph() {
            return this.glyphs.pop();
        };

        Telestration.prototype.removeGlyph = function removeGlyph(glyph) {
            var glyphIndex = this.glyphs.indexOf(glyph);
            if (glyphIndex != -1) this.glyphs.splice(glyphIndex, 1);
        };

        Telestration.prototype.clearGlyphs = function clearGlyphs() {
            this.glyphs.length = 0;
        };

        return function(telestrations) {

            var createTelestration = function createTelestration(time, gameId, playId) {

                var newTelestration = new Telestration(gameId, time, playId);

                telestrations.push(newTelestration);

                return newTelestration;
            };

            telestration.getTelestration = function getTelestration(time, gameId, playId) {

                // check if telestration exists by time
                var telestration = telestrations.filter(function(telestration) {
                    return telestration.time === time;
                });

                // telestration already exists
                if (telestration.length) return telestration;
                // telestration does not exist, create a new one
                else return createTelestration(time, gameId, playId);
            };

            return telestrations;
        };
    }
];
