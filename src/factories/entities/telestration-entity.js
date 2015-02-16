
/* TelestrationEntity */

module.exports = [
    'TelestrationValue',
    function(TelestrationValue) {

        var TelestrationEntity = function TelestrationEntity() {

            this.getTelestration = function getTelestration(time, gameId, playId) {

                if (!time && parseInt(time) !== time) throw new Error('getTelestration missing required \'time\' parameter or time parameter is not an integer.');

                var filteredTelestrations = this.filter(function getTelestrationAtTime(telestration) {
                    if (telestration.time === time) return telestration;
                });

                // telestration at 'time' does not exist
                if (!filteredTelestrations.length) return this.addNewTelestration(time, gameId, playId);
                // return the existing telestration at 'time'
                else return filteredTelestrations[0];

            };

            this.addNewTelestration = function addNewTelestration(time, gameId, playId) {

                var newTelestration = new TelestrationValue(time, gameId); // TODO: Create & Return Proper Telestration Values Here using a Factory Service?

                this.push(newTelestration);

                return newTelestration;
            };

        };

        var extendTelestrationEntityModel = function telestrationEnity(telestrationEntityModel) {

            if (!telestrationEntityModel) throw Error('extendTelestrationEntityModel requires telestrationEntityModel <Array>');

            TelestrationEntity.call(telestrationEntityModel);
        };

        return extendTelestrationEntityModel;
    }
];
