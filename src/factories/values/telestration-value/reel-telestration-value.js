
/* ReelTelestrationValue Object - Extends TelestrationValue */

module.exports = [
    'TelestrationValue',
    function(TelestrationValue) {

        function ReelTelestrationValue(time, reelId, playId) {

            if (!reelId) throw new Error('telestration object requires reelId');
            if (!playId) throw new Error('telestration object requires playId');

            // Telestration Model
            TelestrationValue.call(this, time);

            // ReelTelestration Model extending Telestration Model
            this.reelId = reelId;
            this.playId = playId;

        }
        angular.inheritPrototype(ReelTelestrationValue, TelestrationValue);

        return ReelTelestrationValue;

    }
];
