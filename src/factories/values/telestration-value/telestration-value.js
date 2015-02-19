
/* TelestrationValue Object */

module.exports = [
    function() {

        function TelestrationValue(time) {

            if (!time && parseInt(time) !== time) throw new Error('TelestrationValue is missing required \'time\' parameter or time parameter is not an integer.');

            // Telestration Model
            this.time = time;
            this.glyphs = [];

        }

        return TelestrationValue;
    }
];
