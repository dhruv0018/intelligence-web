
/* RawTelestrationEntity */

module.exports = [
    'TelestrationEntity', 'ExtendTelestrationValue', 'RawTelestrationValue',
    function(telestrationEntity, extendTelestrationValue, RawTelestrationValue) {

        var RawTelestrationEntity = function RawTelestrationEntity(telestrationEntityModel, parentId) {

            // Extend existing telestration objects
            telestrationEntity(telestrationEntityModel);

            // Extend play telestrations
            telestrationEntityModel.forEach(function extendTelestrationValues(telestration) {
                extendTelestrationValue(telestration);
            });

            telestrationEntityModel.addNewTelestration = function addNewTelestration(time) {

                var newTelestration = new RawTelestrationValue(time, parentId);

                if (!newTelestration) return null;

                // Extend the new Telestration
                extendTelestrationValue(newTelestration);

                this.push(newTelestration);

                return newTelestration;

            };

        };
        angular.inheritPrototype(RawTelestrationEntity, telestrationEntity);

        return RawTelestrationEntity;
    }
];
