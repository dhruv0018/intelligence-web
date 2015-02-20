
/* PlayTelestrationEntity */

module.exports = [
    'TelestrationEntity', 'PlayTelestrationValue', 'ExtendTelestrationValue',
    function(TelestrationEntity, PlayTelestrationValue, ExtendTelestrationValue) {

        var PlayTelestrationEntity = function PlayTelestrationEntity(telestrationEntityModel, parentId) {

            // Extend existing telestration objects
            TelestrationEntity(telestrationEntityModel);

            // Extend play telestrations
            telestrationEntityModel.forEach(function extendTelestrationValues(telestration) {
                ExtendTelestrationValue(telestration);
            });

            // Override Base addNewTelestration
            telestrationEntityModel.addNewTelestration = function addNewTelestration(time, playId) {

                var newTelestration = new PlayTelestrationValue(time, parentId, playId);

                if (!newTelestration) return null;

                // Extend the new Telestration
                ExtendTelestrationValue(newTelestration);

                this.push(newTelestration);

                return newTelestration;

            };

        };
        angular.inheritPrototype(PlayTelestrationEntity, TelestrationEntity);

        return PlayTelestrationEntity;
    }
];
