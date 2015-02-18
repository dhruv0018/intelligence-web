
/* ReelTelestrationEntity */

module.exports = [
    'TelestrationEntity', 'ExtendTelestrationValue',
    function(TelestrationEntity, ExtendTelestrationValue) {

        var ReelTelestrationEntity = function ReelTelestrationEntity(telestrationEntityModel, parentId) {

            // Extend existing telestration objects
            TelestrationEntity(telestrationEntityModel, parentId);

            // Extend play telestrations
            telestrationEntityModel.forEach(function extendTelestrationValues(telestration) {
                ExtendTelestrationValue(telestration);
            });

            telestrationEntityModel.addNewTelestration = function addNewTelestration(time, playId) {

                var newTelestration = new ReelTelestrationValue(time, parentId, playId);

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
