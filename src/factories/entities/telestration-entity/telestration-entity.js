
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

                // telestration at 'time' does not exist
                if (!filteredTelestrations.length) return this.addNewTelestration(time, playId);
                // return the existing telestration at 'time'
                else return filteredTelestrations[0];

            };

        };

        var extendTelestrationEntityModel = function extendTelestrationEntityModel(telestrationEntityModel) {

            if (!telestrationEntityModel) throw Error('extendTelestrationEntityModel requires telestrationEntityModel <Array>');

            TelestrationEntity.call(telestrationEntityModel);
        };

        return extendTelestrationEntityModel;
    }
];
