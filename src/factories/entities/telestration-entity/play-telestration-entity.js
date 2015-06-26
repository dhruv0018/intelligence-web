
/* PlayTelestrationEntity */

module.exports = [
    'TelestrationEntity', 'PlayTelestrationValue', 'ExtendTelestrationValue',
    function(telestrationEntity, PlayTelestrationValue, extendTelestrationValue) {

        var PlayTelestrationEntity = function PlayTelestrationEntity(telestrationEntityModel, parentId) {

            // Extend existing telestration objects
            telestrationEntity(telestrationEntityModel);

            // Extend play telestrations
            telestrationEntityModel.forEach(function extendTelestrationValues(telestration) {
                extendTelestrationValue(telestration);
            });

            // Override Base addNewTelestration
            telestrationEntityModel.addNewTelestration = function addNewTelestration(time, playId) {

                var newTelestration = new PlayTelestrationValue(time, parentId, playId);

                if (!newTelestration) return null;

                // Extend the new Telestration
                extendTelestrationValue(newTelestration);

                this.push(newTelestration);

                return newTelestration;

            };

        };
        angular.inheritPrototype(PlayTelestrationEntity, telestrationEntity);

        return PlayTelestrationEntity;
    }
];
