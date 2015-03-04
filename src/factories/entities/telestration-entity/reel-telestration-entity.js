
/* ReelTelestrationEntity */

module.exports = [
    'TelestrationEntity', 'ExtendTelestrationValue', 'ReelTelestrationValue',
    function(telestrationEntity, extendTelestrationValue, ReelTelestrationValue) {

        var ReelTelestrationEntity = function ReelTelestrationEntity(telestrationEntityModel, parentId) {

            // Extend existing telestration objects
            telestrationEntity(telestrationEntityModel, parentId);

            // Extend play telestrations
            telestrationEntityModel.forEach(function extendTelestrationValues(telestration) {
                extendTelestrationValue(telestration);
            });

            telestrationEntityModel.addNewTelestration = function addNewTelestration(time, playId) {

                var newTelestration = new ReelTelestrationValue(time, parentId, playId);

                if (!newTelestration) return null;

                // Extend the new Telestration
                extendTelestrationValue(newTelestration);

                this.push(newTelestration);

                return newTelestration;

            };

        };
        angular.inheritPrototype(ReelTelestrationEntity, telestrationEntity);

        return ReelTelestrationEntity;
    }
];
