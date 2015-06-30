
/* TelestrationValue Object */

module.exports = [
    function() {

        function TelestrationValue(time) {

            if (!time) throw new Error('TelestrationValue is missing required \'time\' parameter');
            if (typeof time !== 'number') throw new Error('TelestrationValue time parameter is not a number.');

            // Telestration Model
            this.time = time;
            this.glyphs = [];

        }

        return TelestrationValue;
    }
];
