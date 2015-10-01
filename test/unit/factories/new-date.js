const momentTimezone = require('moment-timezone');

const assert  = chai.assert;
const expect  = chai.expect;
const should  = chai.should();

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

        it('return a Date', inject(NewDate => {

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

        it('return a Date', inject(NewDate => {

            expect(newStartDate).to.be.an.instanceof(Date);
            expect(existingStartDate).to.be.an.instanceof(Date);
        }));

        it('return tomorrow\'s Date if no existing date', inject(NewDate => {

            let controlDate = momentTimezone(undefined, 'America/New_York').add(1, 'days');

            /* FIXME: Although this works, we should find a better way to get a
             * 'control date' to test against. Aside from the time, the date
             * above is calculated almost exactly as it is in the factory (using
             * moment.js). The challenge here is to determine the month and day
             * two days out that avoids excessive calculation that shouldn't be
             * in the unit tests. */
            expect(newStartDate.getMonth()).to.equal(controlDate.month());
            expect(newStartDate.getDate()).to.equal(controlDate.date());
        }));

        it('return tomorrow\'s Date at midnight if no existing date', inject(NewDate => {

            expect(newStartDate.getHours()).to.equal(0);
        }));

        it('return tomorrow\'s Date at the top of the hour if no existing date', inject(NewDate => {

            expect(newStartDate.getMinutes()).to.equal(0);
        }));

        it('return tomorrow\'s Date with zero seconds if no existing date', inject(NewDate => {

            expect(newStartDate.getSeconds()).to.equal(0);
        }));

        it('return tomorrow\'s Date with zero milliseconds if no existing date', inject(NewDate => {

            expect(newStartDate.getMilliseconds()).to.equal(0);
        }));

        it('should return a Date from existing date strings', inject(NewDate => {

            expect(existingStartDate).to.be.an.instanceof(Date);
        }));

        it('should return a Date from existing date strings with the same year', inject(NewDate => {

            expect(existingStartDate.getFullYear()).to.equal(2014);
        }));

        it('should return a Date from existing date strings with the same month', inject(NewDate => {

            expect(existingStartDate.getMonth()).to.equal(7);
        }));

        it('should return a Date from existing date strings with the same day', inject(NewDate => {

            expect(existingStartDate.getDate()).to.equal(1);
        }));

        it('should return a Date from existing date strings with the same hours', inject(NewDate => {

            expect(existingStartDate.getHours()).to.equal(0);
        }));

        it('should return a Date from existing date strings with the same minutes', inject(NewDate => {

            expect(existingStartDate.getMinutes()).to.equal(0);
        }));

        it('should return a Date from existing date strings with the same seconds', inject(NewDate => {

            expect(existingStartDate.getSeconds()).to.equal(0);
        }));

        it('should return a Date from existing date strings with the same timezone', inject(NewDate => {

            expect(existingStartDate.getTimezoneOffset()).to.equal(240);
        }));

        it('should throw an error if existing date is an invalid string', inject(NewDate => {

            expect(() => NewDate.generatePlanStartDate('Not a real date')).to.throw(Error);
            expect(() => NewDate.generatePlanStartDate('')).to.throw(Error);
            expect(() => NewDate.generatePlanStartDate(' ')).to.throw(Error);
        }));

        it('should throw an error if existing date is an invalid array', inject(NewDate => {

            expect(() => NewDate.generatePlanStartDate(['not', 'a', 'real', 'date'])).to.throw(Error);
            expect(() => NewDate.generatePlanStartDate([])).to.throw(Error);
        }));

        it('should throw an error if existing date is an invalid object', inject(NewDate => {

            expect(() => NewDate.generatePlanStartDate({'not': 'a', 'real': 'date'})).to.throw(Error);
            expect(() => NewDate.generatePlanStartDate({})).to.throw(Error);
        }));

        it('should throw an error if existing date is a function', inject(NewDate => {

            expect(() => NewDate.generatePlanStartDate(function () {})).to.throw(Error);
        }));
    });

    describe('generatePlanEndDate method', () => {

        let newEndDate;
        let existingEndDate;

        beforeEach(inject(NewDate => {

            newEndDate        = NewDate.generatePlanEndDate();
            existingEndDate   = NewDate.generatePlanEndDate('2014-08-02T03:59:59+00:00');
        }));

        it('return a Date', inject(NewDate => {

            expect(newEndDate).to.be.an.instanceof(Date);
            expect(existingEndDate).to.be.an.instanceof(Date);
        }));

        it('return the day after tomorrow, just before midnight if no existing date', inject(NewDate => {

            let controlDate = momentTimezone(undefined, 'America/New_York').add(2, 'days');

            /* FIXME: Although this works, we should find a better way to get a
             * 'control date' to test against. Aside from the time, the date
             * above is calculated almost exactly as it is in the factory (using
             * moment.js). The challenge here is to determine the month and day
             * two days out that avoids excessive calculation that shouldn't be
             * in the unit tests. */
            expect(newEndDate.getMonth()).to.equal(controlDate.month());
            expect(newEndDate.getDate()).to.equal(controlDate.date());
        }));

        it('return a Date at 11 pm if no existing date', inject(NewDate => {

            expect(newEndDate.getHours()).to.equal(23);
        }));

        it('return a Date at 59 minutes if no existing date', inject(NewDate => {

            expect(newEndDate.getMinutes()).to.equal(59);
        }));

        it('return a Date at 59 seconds if no existing date', inject(NewDate => {

            expect(newEndDate.getSeconds()).to.equal(59);
        }));

        it('return a Date at 999 milliseconds if no existing date', inject(NewDate => {

            expect(newEndDate.getMilliseconds()).to.equal(999);
        }));

        it('should return a Date from existing date strings', inject(NewDate => {

            expect(existingEndDate).to.be.an.instanceof(Date);
        }));

        it('should return a Date from existing date strings with the same year', inject(NewDate => {

            expect(existingEndDate.getFullYear()).to.equal(2014);
        }));

        it('should return a Date from existing date strings with the same month', inject(NewDate => {

            expect(existingEndDate.getMonth()).to.equal(7);
        }));

        it('should return a Date from existing date strings with the same day', inject(NewDate => {

            expect(existingEndDate.getDate()).to.equal(1);
        }));

        it('should return a Date from existing date strings with the same hours', inject(NewDate => {

            expect(existingEndDate.getHours()).to.equal(23);
        }));

        it('should return a Date from existing date strings with the same minutes', inject(NewDate => {

            expect(existingEndDate.getMinutes()).to.equal(59);
        }));

        it('should return a Date from existing date strings with the same seconds', inject(NewDate => {

            expect(existingEndDate.getSeconds()).to.equal(59);
        }));

        it('should return a Date from existing date strings with the same timezone', inject(NewDate => {

            expect(existingEndDate.getTimezoneOffset()).to.equal(240);
        }));

        it('should throw an error if existing date is an invalid string', inject(NewDate => {

            expect(() => NewDate.generatePlanEndDate('Not a real date')).to.throw(Error);
            expect(() => NewDate.generatePlanEndDate('')).to.throw(Error);
            expect(() => NewDate.generatePlanEndDate(' ')).to.throw(Error);
        }));

        it('should throw an error if existing date is an invalid array', inject(NewDate => {

            expect(() => NewDate.generatePlanEndDate(['not', 'a', 'real', 'date'])).to.throw(Error);
            expect(() => NewDate.generatePlanEndDate([])).to.throw(Error);
        }));

        it('should throw an error if existing date is an invalid object', inject(NewDate => {

            expect(() => NewDate.generatePlanEndDate({'not': 'a', 'real': 'date'})).to.throw(Error);
            expect(() => NewDate.generatePlanEndDate({})).to.throw(Error);
        }));

        it('should throw an error if existing date is a function', inject(NewDate => {

            expect(() => NewDate.generatePlanEndDate(function () {})).to.throw(Error);
        }));
    });
});
