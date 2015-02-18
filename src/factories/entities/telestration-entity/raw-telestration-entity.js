
/* RawTelestrationEntity */

module.exports = [
    'TelestrationEntity', 'ExtendTelestrationValue',
    function(TelestrationEntity, ExtendTelestrationValue) {

        var RawTelestrationEntity = function RawTelestrationEntity(telestrationEntityModel, parentId) {

            // Extend existing telestration objects
            TelestrationEntity(telestrationEntityModel);

            // Extend play telestrations
            telestrationEntityModel.forEach(function extendTelestrationValues(telestration) {
                ExtendTelestrationValue(telestration);
            });

            telestrationEntityModel.addNewTelestration = function addNewTelestration(time) {

                var newTelestration = new RawTelestrationValue(time, parentId);

                // Extend the new Telestration
                ExtendTelestrationValue(newTelestration);

                this.push(newTelestration);

                return newTelestration;

            };

        };
        angular.inheritPrototype(RawTelestrationEntity, TelestrationEntity);

        return RawTelestrationEntity;
    }
];
