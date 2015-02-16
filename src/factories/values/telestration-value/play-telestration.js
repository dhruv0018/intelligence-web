
/* PlayTelestrationValue Object - Extends TelestrationValue */

module.exports = [
    'TelestrationValue',
    function(TelestrationValue) {

        function PlayTelestrationValue(time, gameId, playId) {

            if (!playId) throw new Error('telestration object requires playId');

            // Telestration Model
            TelestrationValue.call(this, time, gameId);

            // PlayTelestration Model extending Telestration Model
            this.playId = playId;

        }
        angular.inheritPrototype(PlayTelestrationValue, TelestrationValue);

        return PlayTelestrationValue;
    }
];
