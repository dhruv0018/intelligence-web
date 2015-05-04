
/* TelestrationEntity - Abstract Class*/

module.exports = [
    'ArrayEntity', 'TelestrationValue', 'ExtendTelestrationValue', 'CUEPOINT_TYPES',
    function(arrayEntity, TelestrationValue, ExtendTelestrationValue, CUEPOINT_TYPES) {

        var TelestrationEntity = function TelestrationEntity() {

            /* Extend ArrayEntity */

            arrayEntity.call(this);


            this.getTelestration = function getTelestration(time, playId) {

                if (!time && parseInt(time) !== time) throw new Error('getTelestration missing required \'time\' parameter or time parameter is not an integer.');

                var filteredTelestrations = this.filter(function getTelestrationAtTime(telestration) {
                    if (telestration.time === time) return telestration;
                });

                // return the existing telestration at 'time'
                if (filteredTelestrations.length) return filteredTelestrations[0];
                // telestration at 'time' does not exist
                else return null;
            };

            /*
            * getTelestrationCuePoints
            * @param playId (optional)
            */
            this.getTelestrationCuePoints = function getTelestrationCuePoints(playId, playAbsoluteStartTime = 0) {

                if (!this.length) return [];

                var cuePoints = [];

                var filteredTelestrations = this.filter(function getTelestrationsWithGlyphs(telestration) {
                    if (telestration.hasGlyphs()) {
                        if (playId) {
                            if (telestration.playId === playId) return true;
                            else return false;
                        } else {
                            return true;
                        }
                    }
                });

                cuePoints = filteredTelestrations.map(function(telestration) {

                    // Cuepoint times are relative to the play if the playAbsoluteStartTime is specified
                    return {
                        time: Math.abs(playAbsoluteStartTime - telestration.time),
                        type: CUEPOINT_TYPES.TELESTRATION
                    };
                });

                return cuePoints;
            };
        };

        var extendTelestrationEntityModel = function extendTelestrationEntityModel(telestrationEntityModel) {

            if (!telestrationEntityModel) throw Error('extendTelestrationEntityModel requires telestrationEntityModel <Array>');

            TelestrationEntity.call(telestrationEntityModel);
        };

        return extendTelestrationEntityModel;
    }
];
