
/* RawTelestrationValue Object - Extends TelestrationValue */

module.exports = [
    'TelestrationValue',
    function(TelestrationValue) {

        function RawTelestrationValue(time, gameId) {

            if (!gameId) throw new Error('telestration object requires gameId');

            // Telestration Model
            TelestrationValue.call(this, time);

            // RawTelestration Model extending Telestration Model
            this.gameId = gameId;

        }
        angular.inheritPrototype(RawTelestrationValue, TelestrationValue);

        return RawTelestrationValue;

    }
];
