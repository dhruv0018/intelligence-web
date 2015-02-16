
/* RawTelestrationValue Object - Extends TelestrationValue */

module.exports = [
    'TelestrationValue',
    function(TelestrationValue) {

        function RawTelestrationValue(time, gameId) {

            TelestrationValue.call(this, time, gameId);

        }
        angular.inheritPrototype(RawTelestrationValue, TelestrationValue);

        return RawTelestrationValue;
    }
];
