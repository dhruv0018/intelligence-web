const momentTimezone = require('moment-timezone');

const assert  = chai.assert;
const expect  = chai.expect;
const should  = chai.should();

const TIME_ZONE = 'America/New_York';

describe('NewDate Factory', () => {

    beforeEach(angular.mock.module('intelligence-web-client'));

    it('should exist', inject(NewDate => {

        expect(NewDate).to.exist;
    }));

    it('should have public API', inject(NewDate => {

        expect(NewDate).to.respondTo('generateNow');
        expect(NewDate).to.respondTo('generatePlanStartDate');
        expect(NewDate).to.respondTo('generatePlanEndDate');
        expect(NewDate).to.respondTo('generatePackageStartDate');
        expect(NewDate).to.respondTo('generatePackageEndDate');
    }));

    describe('generateNow method', () => {

        it('should return a Date', inject(NewDate => {

            let now = NewDate.generateNow();

            expect(now).to.be.an.instanceof(Date);
        }));
    });

    describe('generatePlanStartDate method', () => {

        let newStartDate;
        let existingStartDate;

        beforeEach(inject(NewDate => {
            sinon.stub(console, "error");
            newStartDate      = NewDate.generatePlanStartDate();
            existingStartDate = NewDate.generatePlanStartDate('2014-08-01T04:00:00+00:00');
        }));

        afterEach(inject(() => {
            console.error.restore();
        }));

        it('should return a Date', inject(NewDate => {

            expect(newStartDate).to.be.an.instanceof(Date);
            expect(existingStartDate).to.be.an.instanceof(Date);
        }));

        it('should return tomorrow\'s Date if no existing date', inject(NewDate => {

            /* FIXME: The control date does exactly what the tested method does
             * (the momentTimezone part at least), so this test has questionable
             * value. But, it does however test the logic in the method that
             * determines how the date is created and that the correct date is
             * returned. Find a better way to do this. */

            let controlDate = momentTimezone.tz(undefined, TIME_ZONE)
                .startOf('day')
                .add(1, 'days');

            let newStartDateISOString = newStartDate.toISOString();
            let controlDateISOString = controlDate.toDate().toISOString();

            expect(newStartDateISOString).to.equal(controlDateISOString);
        }));

        it('should return a Date at midnight of the existing date passed in', () => {

            let controlDateISOString = momentTimezone.tz('2014-08-01T04:00:00+00:00', TIME_ZONE)
                .toISOString();
            let existingStartDateISOString = existingStartDate.toISOString();

            expect(existingStartDateISOString).to.equal(controlDateISOString);
        });

        it('should log an error if existing date is a Boolean', inject(NewDate => {
            NewDate.generatePlanStartDate(false);
            sinon.assert.callCount(console.error, 1);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate plan start date with invalid value \(/));
            NewDate.generatePlanStartDate(true);
            sinon.assert.callCount(console.error, 2);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate plan start date with invalid value \(/));
        }));

        it('should log an error if existing date is an invalid string', inject(NewDate => {
            NewDate.generatePlanStartDate('2014 22');
            sinon.assert.callCount(console.error, 1);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate plan start date with invalid value \(/));
            NewDate.generatePlanStartDate('Not a real date');
            sinon.assert.callCount(console.error, 2);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate plan start date with invalid value \(/));
            NewDate.generatePlanStartDate('');
            sinon.assert.callCount(console.error, 3);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate plan start date with invalid value \(/));
            NewDate.generatePlanStartDate(' ');
            sinon.assert.callCount(console.error, 4);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate plan start date with invalid value \(/));
        }));

        it('should log an error if existing date is an invalid array', inject(NewDate => {
            NewDate.generatePlanStartDate(['not', 'a', 'real', 'date']);
            sinon.assert.callCount(console.error, 1);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate plan start date with invalid value \(/));
            NewDate.generatePlanStartDate([]);
            sinon.assert.callCount(console.error, 2);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate plan start date with invalid value \(/));
        }));

        it('should log an error if existing date is an invalid object', inject(NewDate => {
            NewDate.generatePlanStartDate({'not': 'a', 'real': 'date'});
            sinon.assert.callCount(console.error, 1);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate plan start date with invalid value \(/));
            NewDate.generatePlanStartDate({});
            sinon.assert.callCount(console.error, 2);
            sinon.assert.alwaysCalledWithMatch(console.error, sinon.match(/NewDate Factory: Attempt to generate plan start date with invalid value \(/));
        }));

        it('should log an error if existing date is a function', inject(NewDate => {
            NewDate.generatePlanStartDate(function () {});
            sinon.assert.calledOnce(console.error);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate plan start date with invalid value \(/));
        }));
    });

    describe('generatePlanEndDate method', () => {

        let newEndDate;
        let existingEndDate;

        beforeEach(inject(NewDate => {
            sinon.stub(console, "error");
            newEndDate = NewDate.generatePlanEndDate();
            existingEndDate = NewDate.generatePlanEndDate('2014-08-02T03:59:59+00:00');
        }));

        afterEach(inject(() => {
            console.error.restore();
        }));

        it('should return a Date', inject(NewDate => {

            expect(newEndDate).to.be.an.instanceof(Date);
            expect(existingEndDate).to.be.an.instanceof(Date);
        }));

        it('should return the day after tomorrow, just before midnight if no existing date', () => {

            /* FIXME: The control date does exactly what the tested method does
             * (the momentTimezone part at least), so this test has questionable
             * value. But, it does however test the logic in the method that
             * determines how the date is created and that the correct date is
             * returned. Find a better way to do this. */

            let controlDate = momentTimezone.tz(undefined, TIME_ZONE)
                .endOf('day')
                .add(2, 'days');

            let newEndDateISOString = newEndDate.toISOString();
            let controlDateISOString = controlDate.toDate().toISOString();

            expect(newEndDateISOString).to.equal(controlDateISOString);
        });

        it('should return the same day, just before midnight if existing date', () => {

            /* FIXME: The control date does exactly what the tested method does
             * (the momentTimezone part at least), so this test has questionable
             * value. But, it does however test the logic in the method that
             * determines how the date is created and that the correct date is
             * returned. Find a better way to do this. */

            let controlDateISOString = momentTimezone.tz('2014-08-02T03:59:59.999Z', TIME_ZONE)
                .toISOString();
            let existingEndDateISOString = existingEndDate.toISOString();

            expect(existingEndDateISOString).to.equal(controlDateISOString);
        });

        it('should log an error if existing date is a Boolean', inject(NewDate => {
            NewDate.generatePlanEndDate(false);
            sinon.assert.callCount(console.error, 1);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate plan end date with invalid value \(/));
            NewDate.generatePlanEndDate(true);
            sinon.assert.callCount(console.error, 2);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate plan end date with invalid value \(/));
        }));

        it('should log an error if existing date is an invalid string', inject(NewDate => {
            NewDate.generatePlanEndDate('2014 22');
            sinon.assert.callCount(console.error, 1);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate plan end date with invalid value \(/));
            NewDate.generatePlanEndDate('Not a real date');
            sinon.assert.callCount(console.error, 2);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate plan end date with invalid value \(/));
            NewDate.generatePlanEndDate('');
            sinon.assert.callCount(console.error, 3);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate plan end date with invalid value \(/));
            NewDate.generatePlanEndDate(' ');
            sinon.assert.callCount(console.error, 4);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate plan end date with invalid value \(/));
        }));

        it('should log an error if existing date is an invalid array', inject(NewDate => {
            NewDate.generatePlanEndDate(['not', 'a', 'real', 'date']);
            sinon.assert.callCount(console.error, 1);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate plan end date with invalid value \(/));
            NewDate.generatePlanEndDate([]);
            sinon.assert.callCount(console.error, 2);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate plan end date with invalid value \(/));
        }));

        it('should log an error if existing date is an invalid object', inject(NewDate => {
            NewDate.generatePlanEndDate({'not': 'a', 'real': 'date'});
            sinon.assert.callCount(console.error, 1);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate plan end date with invalid value \(/));
            NewDate.generatePlanEndDate({});
            sinon.assert.callCount(console.error, 2);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate plan end date with invalid value \(/));
        }));

        it('should log an error if existing date is a function', inject(NewDate => {
            NewDate.generatePlanEndDate(function () {});
            sinon.assert.calledOnce(console.error);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate plan end date with invalid value \(/));
        }));
    });

    describe('generatePackageStartDate method', () => {

        let newStartDate;
        let existingStartDate;

        beforeEach(inject(NewDate => {
            sinon.stub(console, "error");
            newStartDate      = NewDate.generatePackageStartDate();
            existingStartDate = NewDate.generatePackageStartDate('2014-08-01T04:00:00+00:00');
        }));

        afterEach(inject(() => {
            console.error.restore();
        }));

        it('should return a Date', inject(NewDate => {

            expect(newStartDate).to.be.an.instanceof(Date);
            expect(existingStartDate).to.be.an.instanceof(Date);
        }));

        it('should return today\'s Date if no existing date', inject(NewDate => {

            /* FIXME: The control date does exactly what the tested method does
             * (the momentTimezone part at least), so this test has questionable
             * value. But, it does however test the logic in the method that
             * determines how the date is created and that the correct date is
             * returned. Find a better way to do this. */

            let controlDate = momentTimezone.tz(undefined, TIME_ZONE)
                .startOf('day');

            let newStartDateISOString = newStartDate.toISOString();
            let controlDateISOString = controlDate.toDate().toISOString();

            expect(newStartDateISOString).to.equal(controlDateISOString);
        }));

        it('should return a Date at midnight of the existing date passed in', () => {

            let controlDateISOString = momentTimezone.tz('2014-08-01T04:00:00+00:00', TIME_ZONE)
                .toISOString();
            let existingStartDateISOString = existingStartDate.toISOString();

            expect(existingStartDateISOString).to.equal(controlDateISOString);
        });

        it('should log an error if existing date is a Boolean', inject(NewDate => {
            NewDate.generatePackageStartDate(false);
            sinon.assert.callCount(console.error, 1);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate package start date with invalid value \(/));
            NewDate.generatePackageStartDate(true);
            sinon.assert.callCount(console.error, 2);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate package start date with invalid value \(/));
        }));

        it('should log an error if existing date is an invalid string', inject(NewDate => {
            NewDate.generatePackageStartDate('2014 22');
            sinon.assert.callCount(console.error, 1);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate package start date with invalid value \(/));
            NewDate.generatePackageStartDate('Not a real date');
            sinon.assert.callCount(console.error, 2);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate package start date with invalid value \(/));
            NewDate.generatePackageStartDate('');
            sinon.assert.callCount(console.error, 3);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate package start date with invalid value \(/));
            NewDate.generatePackageStartDate(' ');
            sinon.assert.callCount(console.error, 4);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate package start date with invalid value \(/));
        }));

        it('should log an error if existing date is an invalid array', inject(NewDate => {
            NewDate.generatePackageStartDate(['not', 'a', 'real', 'date']);
            sinon.assert.callCount(console.error, 1);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate package start date with invalid value \(/));
            NewDate.generatePackageStartDate([]);
            sinon.assert.callCount(console.error, 2);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate package start date with invalid value \(/));
        }));

        it('should log an error if existing date is an invalid object', inject(NewDate => {
            NewDate.generatePackageStartDate({'not': 'a', 'real': 'date'});
            sinon.assert.callCount(console.error, 1);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate package start date with invalid value \(/));
            NewDate.generatePackageStartDate({});
            sinon.assert.callCount(console.error, 2);
            sinon.assert.alwaysCalledWithMatch(console.error, sinon.match(/NewDate Factory: Attempt to generate package start date with invalid value \(/));
        }));

        it('should log an error if existing date is a function', inject(NewDate => {
            NewDate.generatePackageStartDate(function () {});
            sinon.assert.calledOnce(console.error);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate package start date with invalid value \(/));
        }));
    });

    describe('generatePackageEndDate method', () => {

        let newEndDate;
        let existingEndDate;

        beforeEach(inject(NewDate => {
            sinon.stub(console, "error");
            newEndDate = NewDate.generatePackageEndDate();
            existingEndDate = NewDate.generatePackageEndDate('2014-08-02T03:59:59+00:00');
        }));

        afterEach(inject(() => {
            console.error.restore();
        }));

        it('should return a Date', inject(NewDate => {

            expect(newEndDate).to.be.an.instanceof(Date);
            expect(existingEndDate).to.be.an.instanceof(Date);
        }));

        it('should return the day after tomorrow, just before midnight if no existing date', () => {

            /* FIXME: The control date does exactly what the tested method does
             * (the momentTimezone part at least), so this test has questionable
             * value. But, it does however test the logic in the method that
             * determines how the date is created and that the correct date is
             * returned. Find a better way to do this. */

            let controlDate = momentTimezone.tz(undefined, TIME_ZONE)
                .endOf('day')
                .add(1, 'month')
                .subtract(1, 'day');

            let newEndDateISOString = newEndDate.toISOString();
            let controlDateISOString = controlDate.toDate().toISOString();

            expect(newEndDateISOString).to.equal(controlDateISOString);
        });

        it('should return the same day, just before midnight if existing date', () => {

            /* FIXME: The control date does exactly what the tested method does
             * (the momentTimezone part at least), so this test has questionable
             * value. But, it does however test the logic in the method that
             * determines how the date is created and that the correct date is
             * returned. Find a better way to do this. */

            let controlDateISOString = momentTimezone.tz('2014-08-02T03:59:59.999Z', TIME_ZONE)
                .toISOString();
            let existingEndDateISOString = existingEndDate.toISOString();

            expect(existingEndDateISOString).to.equal(controlDateISOString);
        });

        it('should log an error if existing date is a Boolean', inject(NewDate => {
            NewDate.generatePackageEndDate(false);
            sinon.assert.callCount(console.error, 1);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate package end date with invalid value \(/));
            NewDate.generatePackageEndDate(true);
            sinon.assert.callCount(console.error, 2);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate package end date with invalid value \(/));
        }));

        it('should log an error if existing date is an invalid string', inject(NewDate => {
            NewDate.generatePackageEndDate('2014 22');
            sinon.assert.callCount(console.error, 1);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate package end date with invalid value \(/));
            NewDate.generatePackageEndDate('Not a real date');
            sinon.assert.callCount(console.error, 2);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate package end date with invalid value \(/));
            NewDate.generatePackageEndDate('');
            sinon.assert.callCount(console.error, 3);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate package end date with invalid value \(/));
            NewDate.generatePackageEndDate(' ');
            sinon.assert.callCount(console.error, 4);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate package end date with invalid value \(/));
        }));

        it('should log an error if existing date is an invalid array', inject(NewDate => {
            NewDate.generatePackageEndDate(['not', 'a', 'real', 'date']);
            sinon.assert.callCount(console.error, 1);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate package end date with invalid value \(/));
            NewDate.generatePackageEndDate([]);
            sinon.assert.callCount(console.error, 2);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate package end date with invalid value \(/));
        }));

        it('should log an error if existing date is an invalid object', inject(NewDate => {
            NewDate.generatePackageEndDate({'not': 'a', 'real': 'date'});
            sinon.assert.callCount(console.error, 1);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate package end date with invalid value \(/));
            NewDate.generatePackageEndDate({});
            sinon.assert.callCount(console.error, 2);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate package end date with invalid value \(/));
        }));

        it('should log an error if existing date is a function', inject(NewDate => {
            NewDate.generatePackageEndDate(function () {});
            sinon.assert.calledOnce(console.error);
            sinon.assert.calledWithExactly(console.error, sinon.match(/NewDate Factory: Attempt to generate package end date with invalid value \(/));
        }));
    });
});
