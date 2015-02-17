
/* RawTelestrationEntity */

module.exports = [
    'TelestrationEntity', 'ExtendTelestrationValue',
    function(TelestrationEntity, ExtendTelestrationValue) {

        var RawTelestrationEntity = function RawTelestrationEntity(telestrationEntityModel) {

            // Extend existing telestration objects
            TelestrationEntity(telestrationEntityModel);

            // Extend play telestrations
            telestrationEntityModel.forEach(function extendTelestrationValues(telestration) {
                ExtendTelestrationValue(telestration);
            });

        };
        angular.inheritPrototype(RawTelestrationEntity, TelestrationEntity);

        return RawTelestrationEntity;
    }
];
