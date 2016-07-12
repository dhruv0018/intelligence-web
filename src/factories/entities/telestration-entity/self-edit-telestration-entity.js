/* SelfEditTelestrationEntity */

module.exports = [
    'TelestrationEntity', 'ExtendTelestrationValue', 'SelfEditTelestrationValue',
    function(telestrationEntity, extendTelestrationValue, SelfEditTelestrationValue) {
        var SelfEditTelestrationEntity = function SelfEditTelestrationEntity(telestrationEntityModel, parentId) {

            // Extend existing telestration objects
            telestrationEntity(telestrationEntityModel);

            // Extend play telestrations
            telestrationEntityModel.forEach(function extendTelestrationValues(telestration) {
                extendTelestrationValue(telestration);
            });

            telestrationEntityModel.addNewTelestration = function addNewTelestration(time) {

                var newTelestration = new SelfEditTelestrationValue(time, parentId);

                if (!newTelestration) return null;

                // Extend the new Telestration
                extendTelestrationValue(newTelestration);

                this.push(newTelestration);

                return newTelestration;

            };

        };
        angular.inheritPrototype(SelfEditTelestrationEntity, telestrationEntity);

        return SelfEditTelestrationEntity;
    }
];
