
/* ReelTelestrationEntity */

module.exports = [
    'TelestrationEntity', 'ExtendTelestrationValue', 'ReelTelestrationValue',
    function(TelestrationEntity, ExtendTelestrationValue, ReelTelestrationValue) {

        var ReelTelestrationEntity = function ReelTelestrationEntity(telestrationEntityModel, parentId) {

            // Extend existing telestration objects
            TelestrationEntity(telestrationEntityModel, parentId);

            // Extend play telestrations
            telestrationEntityModel.forEach(function extendTelestrationValues(telestration) {
                ExtendTelestrationValue(telestration);
            });

            telestrationEntityModel.addNewTelestration = function addNewTelestration(time, playId) {

                var newTelestration = new ReelTelestrationValue(time, parentId, playId);

                if (!newTelestration) return null;

                // Extend the new Telestration
                ExtendTelestrationValue(newTelestration);

                this.push(newTelestration);

                return newTelestration;

            };

        };
        angular.inheritPrototype(ReelTelestrationEntity, TelestrationEntity);

        return ReelTelestrationEntity;
    }
];
