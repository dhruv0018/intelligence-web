
/* TelestrationValue Object */

module.exports = [
    function() {

        function TelestrationValue(time) {

            if (!time) throw new Error('TelestrationValue is missing required \'time\' parameter');
            if (parseInt(time, 10) !== time) throw new Error('TelestrationValue time parameter is not an integer.');

            // Telestration Model
            this.time = time;
            this.glyphs = [];

        }

        return TelestrationValue;
    }
];
