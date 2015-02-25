
/* TelestrationEntity - Abstract Class*/

module.exports = [
    'BaseEntity', 'TelestrationValue', 'ExtendTelestrationValue',
    function(BaseEntity, TelestrationValue, ExtendTelestrationValue) {

        var TelestrationEntity = function TelestrationEntity() {

            /* Extend BaseEntity */

            BaseEntity(this);


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

        };

        var extendTelestrationEntityModel = function extendTelestrationEntityModel(telestrationEntityModel) {

            if (!telestrationEntityModel) throw Error('extendTelestrationEntityModel requires telestrationEntityModel <Array>');

            TelestrationEntity.call(telestrationEntityModel);
        };

        return extendTelestrationEntityModel;
    }
];
