var pkg = require('../../package.json');
var moment = require('moment');
var momentTimezone = require('moment-timezone');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);


IntelligenceWebClient.factory('NewDate', function() {

    momentTimezone.tz.add('America/New_York|EST EDT EWT EPT|50 40 40 40|01010101010101010101010101010101010101010101010102301010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-261t0 1nX0 11B0 1nX0 11B0 1qL0 1a10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 RB0 8x40 iv0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0');

    return {
        //start day at 0 EST
        //end day at 11:59:59 EST
        generateNow: function() {
            return new Date();
        },
        generatePlanStartDate: function (existingDate) {

            let planStartDate;

            if (existingDate !== undefined) {

                /* Attempt to create Date object from exisiting date */
                planStartDate = momentTimezone.tz(existingDate, moment.ISO_8601, 'America/New_York');
            } else {

                /* Get tomorrow's date at midnight */
                planStartDate = momentTimezone.tz('America/New_York')
                    .startOf('day')
                    .add(1, 'day');
            }

            if (!planStartDate.isValid()) {

                throw new Error(`NewDate Factory: Attempt to generate plan start date with invalid value (${existingDate})`);
            }

            return planStartDate.toDate();
        },
        generatePlanEndDate: function (existingDate) {

            let planEndDate;

            if (existingDate !== undefined) {

                planEndDate = momentTimezone.tz(existingDate, moment.ISO_8601, 'America/New_York');
            } else {

                /* Get The day after tomorrow just before midnight */
                planEndDate = momentTimezone.tz('America/New_York')
                    .startOf('day')
                    .add(3, 'day')
                    .subtract(1, 'milliseconds');
            }

            if (!planEndDate.isValid()) {

                throw new Error(`NewDate Factory: Attempt to generate plan end date with invalid value (${existingDate})`);
            }

            return planEndDate.toDate();
        }
    };
});
