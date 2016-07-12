
/* SelfEditTelestrationValue Object - Extends TelestrationValue */

module.exports = [
    'TelestrationValue',
    function(TelestrationValue) {

        function SelfEditTelestrationValue(time, gameId) {

            if (!gameId) throw new Error('telestration object requires gameId');

            // Telestration Model
            TelestrationValue.call(this, time);

            // SelfEditTelestration Model extending Telestration Model
            this.gameId = gameId;

        }
        angular.inheritPrototype(SelfEditTelestrationValue, TelestrationValue);

        return SelfEditTelestrationValue;

    }
];
