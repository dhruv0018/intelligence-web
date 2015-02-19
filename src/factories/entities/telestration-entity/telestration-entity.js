
/* TelestrationEntity - Abstract Class*/

module.exports = [
    'TelestrationValue', 'ExtendTelestrationValue',
    function(TelestrationValue, ExtendTelestrationValue) {

        var TelestrationEntity = function TelestrationEntity() {

            this.getTelestration = function getTelestration(time, playId) {

                if (!time && parseInt(time) !== time) throw new Error('getTelestration missing required \'time\' parameter or time parameter is not an integer.');

                var filteredTelestrations = this.filter(function getTelestrationAtTime(telestration) {
                    if (telestration.time === time) return telestration;
                });

                // telestration at 'time' does not exist
                if (!filteredTelestrations.length) return this.addNewTelestration(time, playId);
                // return the existing telestration at 'time'
                else return filteredTelestrations[0];

            };

            this.unextend = function unextendTelestrationEntity() {

                /* Unextend Contained  */

                this.forEach(function unextendTelestrationValues(telestrationValue) {

                    telestrationValue.unextend();

                });

                /* Delete Functions */

                delete this.getTelestration;
                delete this.addNewTelestration;
                delete this.unextend;
            };

        };

        var extendTelestrationEntityModel = function extendTelestrationEntityModel(telestrationEntityModel) {

            if (!telestrationEntityModel) throw Error('extendTelestrationEntityModel requires telestrationEntityModel <Array>');

            TelestrationEntity.call(telestrationEntityModel);
        };

        return extendTelestrationEntityModel;
    }
];
