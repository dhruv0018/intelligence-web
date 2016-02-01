var pkg = require('../../package.json');
var moment = require('moment');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

/**
 * A service to manage the plan start and end date
 * @module IntelligenceWebClient
 * @name PlanService
 * @type {service}
 */
IntelligenceWebClient.factory('PlanService', PlanService);

PlanService.$inject = [
    'NewDate',
];

function PlanService (
    date
) {

    return {

        getStartDateOfPlan: function getStartDateOfPlan(plan) {

            var planStartDate = date.generatePlanStartDate();

            if (!plan) {
                return planStartDate;
            }

            let endYear = this.getEndDateOfPlan(plan).getFullYear();

            //January is 0, February is 1, and so on.
            planStartDate.setMonth(plan.startMonth);
            planStartDate.setDate(plan.startDay);
            planStartDate.setFullYear(endYear);

            if (plan.startMonth > plan.endMonth) {
                planStartDate = moment(planStartDate).subtract(1, 'year').toDate();
            }

            return planStartDate;
        },
        getEndDateOfPlan: function getEndDateOfPlan(plan) {

            var planEndDate = date.generatePlanEndDate();

            if (!plan) {
                return planEndDate;
            }

            let currentDate = date.generateNow();

            //January is 0, February is 1, and so on.
            planEndDate.setMonth(plan.endMonth);
            planEndDate.setDate(plan.endDay);

            if (planEndDate < currentDate) {
                planEndDate = moment(planEndDate).add(1, 'year').toDate();
            }

            return planEndDate;
        }
    };
}
