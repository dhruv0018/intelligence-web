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

            newStartDate      = NewDate.generatePlanStartDate();
            existingStartDate = NewDate.generatePlanStartDate('2014-08-01T04:00:00+00:00');
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

        it('should throw an error if existing date is a Boolean', inject(NewDate => {

            expect(() => NewDate.generatePlanStartDate(false)).to.throw(Error);
            expect(() => NewDate.generatePlanStartDate(false)).to.throw(/NewDate Factory: Attempt to generate plan start date with invalid value \(/);
            expect(() => NewDate.generatePlanStartDate(true)).to.throw(Error);
            expect(() => NewDate.generatePlanStartDate(false)).to.throw(/NewDate Factory: Attempt to generate plan start date with invalid value \(/);
        }));

        it('should throw an error if existing date is an invalid string', inject(NewDate => {

            expect(() => NewDate.generatePlanStartDate('2014 22')).to.throw(Error);
            expect(() => NewDate.generatePlanStartDate('2014 22')).to.throw(/NewDate Factory: Attempt to generate plan start date with invalid value \(/);
            expect(() => NewDate.generatePlanStartDate('Not a real date')).to.throw(Error);
            expect(() => NewDate.generatePlanStartDate('Not a real date')).to.throw(/NewDate Factory: Attempt to generate plan start date with invalid value \(/);
            expect(() => NewDate.generatePlanStartDate('')).to.throw(Error);
            expect(() => NewDate.generatePlanStartDate('')).to.throw(/NewDate Factory: Attempt to generate plan start date with invalid value \(/);
            expect(() => NewDate.generatePlanStartDate(' ')).to.throw(Error);
            expect(() => NewDate.generatePlanStartDate(' ')).to.throw(/NewDate Factory: Attempt to generate plan start date with invalid value \(/);
        }));

        it('should throw an error if existing date is an invalid array', inject(NewDate => {

            expect(() => NewDate.generatePlanStartDate(['not', 'a', 'real', 'date'])).to.throw(Error);
            expect(() => NewDate.generatePlanStartDate(['not', 'a', 'real', 'date'])).to.throw(/NewDate Factory: Attempt to generate plan start date with invalid value \(/);
            expect(() => NewDate.generatePlanStartDate([])).to.throw(Error);
            expect(() => NewDate.generatePlanStartDate([])).to.throw(/NewDate Factory: Attempt to generate plan start date with invalid value \(/);
        }));

        it('should throw an error if existing date is an invalid object', inject(NewDate => {

            expect(() => NewDate.generatePlanStartDate({'not': 'a', 'real': 'date'})).to.throw(Error);
            expect(() => NewDate.generatePlanStartDate({'not': 'a', 'real': 'date'})).to.throw(/NewDate Factory: Attempt to generate plan start date with invalid value \(/);
            expect(() => NewDate.generatePlanStartDate({})).to.throw(Error);
            expect(() => NewDate.generatePlanStartDate({})).to.throw(/NewDate Factory: Attempt to generate plan start date with invalid value \(/);
        }));

        it('should throw an error if existing date is a function', inject(NewDate => {

            expect(() => NewDate.generatePlanStartDate(function () {})).to.throw(Error);
            expect(() => NewDate.generatePlanStartDate(function () {})).to.throw(/NewDate Factory: Attempt to generate plan start date with invalid value \(/);
        }));
    });

    describe('generatePlanEndDate method', () => {

        let newEndDate;
        let existingEndDate;

        beforeEach(inject(NewDate => {

            newEndDate = NewDate.generatePlanEndDate();
            existingEndDate = NewDate.generatePlanEndDate('2014-08-02T03:59:59+00:00');
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

        it('should throw an error if existing date is a Boolean', inject(NewDate => {

            expect(() => NewDate.generatePlanEndDate(false)).to.throw(Error);
            expect(() => NewDate.generatePlanEndDate(false)).to.throw(/NewDate Factory: Attempt to generate plan end date with invalid value \(/);
            expect(() => NewDate.generatePlanEndDate(true)).to.throw(Error);
            expect(() => NewDate.generatePlanEndDate(true)).to.throw(/NewDate Factory: Attempt to generate plan end date with invalid value \(/);
        }));

        it('should throw an error if existing date is an invalid string', inject(NewDate => {

            expect(() => NewDate.generatePlanEndDate('2014 22')).to.throw(Error);
            expect(() => NewDate.generatePlanEndDate('2014 22')).to.throw(/NewDate Factory: Attempt to generate plan end date with invalid value \(/);
            expect(() => NewDate.generatePlanEndDate('Not a real date')).to.throw(Error);
            expect(() => NewDate.generatePlanEndDate('Not a real date')).to.throw(/NewDate Factory: Attempt to generate plan end date with invalid value \(/);
            expect(() => NewDate.generatePlanEndDate('')).to.throw(Error);
            expect(() => NewDate.generatePlanEndDate('')).to.throw(/NewDate Factory: Attempt to generate plan end date with invalid value \(/);
            expect(() => NewDate.generatePlanEndDate(' ')).to.throw(Error);
            expect(() => NewDate.generatePlanEndDate(' ')).to.throw(/NewDate Factory: Attempt to generate plan end date with invalid value \(/);
        }));

        it('should throw an error if existing date is an invalid array', inject(NewDate => {

            expect(() => NewDate.generatePlanEndDate(['not', 'a', 'real', 'date'])).to.throw(Error);
            expect(() => NewDate.generatePlanEndDate(['not', 'a', 'real', 'date'])).to.throw(/NewDate Factory: Attempt to generate plan end date with invalid value \(/);
            expect(() => NewDate.generatePlanEndDate([])).to.throw(Error);
            expect(() => NewDate.generatePlanEndDate([])).to.throw(/NewDate Factory: Attempt to generate plan end date with invalid value \(/);
        }));

        it('should throw an error if existing date is an invalid object', inject(NewDate => {

            expect(() => NewDate.generatePlanEndDate({'not': 'a', 'real': 'date'})).to.throw(Error);
            expect(() => NewDate.generatePlanEndDate({'not': 'a', 'real': 'date'})).to.throw(/NewDate Factory: Attempt to generate plan end date with invalid value \(/);
            expect(() => NewDate.generatePlanEndDate({})).to.throw(Error);
            expect(() => NewDate.generatePlanEndDate({})).to.throw(/NewDate Factory: Attempt to generate plan end date with invalid value \(/);
        }));

        it('should throw an error if existing date is a function', inject(NewDate => {

            expect(() => NewDate.generatePlanEndDate(function () {})).to.throw(Error);
            expect(() => NewDate.generatePlanEndDate(function () {})).to.throw(/NewDate Factory: Attempt to generate plan end date with invalid value \(/);
        }));
    });
});
