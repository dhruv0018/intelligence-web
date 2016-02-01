var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
var moment = require('moment');

describe('PlanService', function() {

    beforeEach(angular.mock.module('intelligence-web-client'));

    it('should exist', inject(function(PlanService) {

        expect(PlanService).to.exist;
    }));

    let currentDate = moment('2019-04-01T03:59:59+00:00').toDate();

    describe('getStartDateOfPlan', function() {

        it('should return default start date when there is no plan',
            inject(['PlanService','NewDate', function(PlanService, NewDate) {
                sinon.stub(NewDate,'generatePlanStartDate').returns('default start date');
                expect(PlanService.getStartDateOfPlan()).to.equal('default start date');
                sinon.assert.calledOnce(NewDate.generatePlanStartDate);
            }
        ]));

        it('should set the year of start date as the year before end date, when the plan is suppose to next year',
            inject(['PlanService','NewDate', function(PlanService, NewDate) {
                let plan = {
                    startDay : 1,
                    startMonth : 7,
                    endDay : 1,
                    endMonth : 5
                };
                //current date = 2019-04-01, start date = 2018-08-01, end date = 2019-06-01,
                sinon.stub(NewDate,'generatePlanStartDate').returns(currentDate);
                sinon.stub(PlanService,'getEndDateOfPlan').returns(moment('2019-06-01T03:59:59+00:00').toDate());
                expect(PlanService.getStartDateOfPlan(plan).toString()).to.equal(moment('2018-08-01T03:59:59+00:00').toDate().toString());
                sinon.assert.calledOnce(NewDate.generatePlanStartDate);
            }
        ]));

        it('should set the year of start date as the same year as end date, when the plan is suppose to end in same year',
            inject(['PlanService','NewDate', function(PlanService, NewDate) {
                let plan = {
                    startDay : 1,
                    startMonth : 2,
                    endDay : 1,
                    endMonth : 5
                };
                //current date = 2019-04-01, start date = 2019-03-01, end date = 2019-06-01
                sinon.stub(NewDate,'generatePlanStartDate').returns(currentDate);
                sinon.stub(PlanService,'getEndDateOfPlan').returns(moment('2019-06-01T03:59:59+00:00').toDate());
                expect(PlanService.getStartDateOfPlan(plan).toString()).to.equal(moment('2019-03-01T03:59:59+00:00').toDate().toString());
                sinon.assert.calledOnce(NewDate.generatePlanStartDate);
            }
        ]));

    });

    describe('getEndDateOfPlan', function() {

        it('should return default end date when there is no plan',
            inject(['PlanService','NewDate', function(PlanService, NewDate) {
                sinon.stub(NewDate,'generatePlanEndDate').returns('default end date');
                expect(PlanService.getEndDateOfPlan()).to.equal('default end date');
                sinon.assert.calledOnce(NewDate.generatePlanEndDate);
            }
        ]));

        it('should set the year of end date as the current year, when the plan is end date is not reached',
            inject(['PlanService','NewDate', function(PlanService, NewDate) {
                let plan = {
                    startDay : 1,
                    startMonth : 7,
                    endDay : 1,
                    endMonth : 5
                };
                //current date = 2019-04-01, start date = 2018-08-01, end date = 2019-06-01
                sinon.stub(NewDate,'generatePlanEndDate').returns(currentDate);
                sinon.stub(NewDate,'generateNow').returns(currentDate);
                expect(PlanService.getEndDateOfPlan(plan).toString()).to.equal(moment('2019-06-01T03:59:59+00:00').toDate().toString());
                sinon.assert.calledOnce(NewDate.generatePlanEndDate);
            }
        ]));

        it('should set the year of end date as the next year, when the plan is end date is reached',
            inject(['PlanService','NewDate', function(PlanService, NewDate) {
                let plan = {
                    startDay : 1,
                    startMonth : 5,
                    endDay : 1,
                    endMonth : 2
                };
                //current date = 2019-04-01, start date = 2020-05-01, end date = 2021-03-01
                sinon.stub(NewDate,'generatePlanEndDate').returns(moment('2019-04-01T03:59:59+00:00').toDate());
                sinon.stub(NewDate,'generateNow').returns(currentDate);
                expect(PlanService.getEndDateOfPlan(plan).toString()).to.equal(moment('2020-03-01T03:59:59+00:00').toDate().toString());
                sinon.assert.calledOnce(NewDate.generatePlanEndDate);
            }
        ]));
    });

});
