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

        it('return a Date', inject(NewDate => {

            let startDate = NewDate.generatePlanStartDate();

            expect(startDate).to.be.an.instanceof(Date);
        }));

        it('return tomorrow at midnight if no existing date is passed in', inject(NewDate => {

            let startDate  = NewDate.generatePlanStartDate();
            let todaysDate = new Date();

            expect(startDate.getMonth()).to.equal(todaysDate.getMonth());
            expect(startDate.getDate()).to.equal(todaysDate.getDate() + 1);
            expect(startDate.getHours()).to.equal(0);
            expect(startDate.getMinutes()).to.equal(0);
            expect(startDate.getSeconds()).to.equal(0);
            expect(startDate.getMilliseconds()).to.equal(0);
        }));
    });

    describe('generatePlanEndDate method', () => {

        it('return a Date', inject(NewDate => {

            let endDate = NewDate.generatePlanEndDate();

            expect(endDate).to.be.an.instanceof(Date);
        }));

        it('return the day after tomorrow, just before midnight if no existing date is passed in', inject(NewDate => {

            let endDate     = NewDate.generatePlanEndDate();
            let controlDate = momentTimezone(undefined, 'America/New_York').add(2, 'days');

            /* FIXME: Although this works, we should find a better way to get a
             * 'control date' to test against. Aside from the time, the date
             * above is calculated almost exactly as it is in the factory (using
             * moment.js). The challenge here is to determine the month and day
             * two days out that avoids excessive calculation that shouldn't be
             * in the unit tests. */
            expect(endDate.getMonth()).to.equal(controlDate.month());
            expect(endDate.getDate()).to.equal(controlDate.date());
            expect(endDate.getHours()).to.equal(23);
            expect(endDate.getMinutes()).to.equal(59);
            expect(endDate.getSeconds()).to.equal(59);
            expect(endDate.getMilliseconds()).to.equal(999);
        }));
    });
});
