import EventList from '../../../src/collections/eventList';

const srcArray = [
    {
        time: 4252.4299316406
    },
    {
        time: 3052.4299316406
    },
    {
        time: 2914.5400390625
    }
];

describe.only('EventList', () => {
    let srcArrayCopy;
    let sampleList;

    beforeEach(() => {

        srcArrayCopy = srcArray.slice(0);
        sampleList   = new EventList(srcArrayCopy);
    });

    it('should exist.', () => {
        expect(EventList).to.exist;
    });

    it('should be sorted by time', () => {
        let time = 0;
        for (let event of sampleList) {
            expect(event.value.time).to.be.at.least(time);
            time = event.value.time;
        }
    });

    describe('current', () => {

        it('should be able to get an event', () => {
            expect(sampleList.current).to.equal(sampleList.first);
        });

        it('should be able to set an event', () => {
            sampleList.current = sampleList.last;
            expect(sampleList.current).to.equal(sampleList.get(2));
        });
    });

    describe('next', () => {

        it('should return next element relative to the current event if nothing passed in', () => {
            let next = sampleList.next();
            let expectedEvent = sampleList.get(1);
            expect(next.time).to.equal(expectedEvent.time);
        });

        it('should be return next event relative to the passed in event', () => {
            let event = sampleList.get(2);
            let next = sampleList.next(event);
            let expectedEvent = sampleList.last;
            expect(next).to.equal(expectedEvent);
        });

        it('should not advance the state if the advanceState flag set to false', () =>{
            let event = sampleList.first;
            sampleList.current = event;
            let next = sampleList.next(event, false);
            expect(next).to.equal(sampleList.get(1));
            expect(sampleList.current).to.equal(sampleList.first);
        });
    });

    describe('previous', () => {

        it('should return previous element relative to the current event if nothing passed in', () => {
            sampleList.current = sampleList.last;
            let previous = sampleList.previous();
            expect(previous).to.equal(sampleList.get(1));
        });

        it('should be return previous event relative to the passed in event', () => {
            let event = sampleList.get(2);
            let previous = sampleList.previous(event);
            expect(previous).to.equal(sampleList.get(1));
        });

        it('should not advance the state if the advanceState flag set to false', () =>{
            let event = sampleList.get(2);
            sampleList.current = event;
            let previous = sampleList.previous(event, false);
            expect(previous).to.equal(sampleList.get(1));
            expect(sampleList.current).to.equal(sampleList.get(2));
        });
    });

    describe('upperBoundingTime', ()=> {

        it('should return the time of the next event when there is one', () => {
            sampleList.current = sampleList.get(1);
            let upperBoundingTime = sampleList.upperBoundingTime();
            let expectedTime = sampleList.get(2).time;
            expect(upperBoundingTime).to.equal(expectedTime);
        });

        it('should return null if there is no next event', () => {
            let event = sampleList.last;
            sampleList.current = event;
            let upperBoundingTime = sampleList.upperBoundingTime(event);
            let expectedTime = null;
            expect(upperBoundingTime).to.be.null;
        });
    });

});
