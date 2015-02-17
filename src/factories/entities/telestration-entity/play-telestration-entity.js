
/* PlayTelestrationEntity */

module.exports = [
    'TelestrationEntity', 'PlayTelestrationValue', 'ExtendTelestrationValue',
    function(TelestrationEntity, PlayTelestrationValue, ExtendTelestrationValue) {

        var PlayTelestrationEntity = function PlayTelestrationEntity(telestrationEntityModel) {

            // Extend existing telestration objects
            TelestrationEntity(telestrationEntityModel);

            // Extend play telestrations
            telestrationEntityModel.forEach(function extendTelestrationValues(telestration) {
                ExtendTelestrationValue(telestration);
            });

            // Override Base addNewTelestration
            telestrationEntityModel.addNewTelestration = function addNewTelestration(time, gameId, playId) {

                var newTelestration = new PlayTelestrationValue(time, gameId, playId);

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
