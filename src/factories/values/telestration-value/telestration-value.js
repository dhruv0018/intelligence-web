
/* TelestrationValue Object */

module.exports = [
    'Utilities',
    function(utilities) {

        function TelestrationValue(time) {

            if (!time) throw new Error('TelestrationValue is missing required \'time\' parameter');
            if (typeof time !== 'number') throw new Error('TelestrationValue time parameter is not a number.');

            // Telestration Model
            this.time = utilities.toFixedFloat(time);
            this.glyphs = [];

        }

        return TelestrationValue;
    }
];
