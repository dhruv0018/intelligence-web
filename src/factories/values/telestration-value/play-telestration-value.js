
/* PlayTelestrationValue Object - Extends TelestrationValue */

module.exports = [
    'TelestrationValue',
    function(TelestrationValue) {

        function PlayTelestrationValue(time, gameId, playId) {

            if (!gameId) throw new Error('telestration object requires gameId');
            if (!playId) throw new Error('telestration object requires playId');

            // Telestration Model
            TelestrationValue.call(this, time);

            // PlayTelestration Model extending Telestration Model
            this.playId = playId;
            this.gameId = gameId;

        }
        angular.inheritPrototype(PlayTelestrationValue, TelestrationValue);

        return PlayTelestrationValue;

    }
];
