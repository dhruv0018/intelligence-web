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
            expect(sampleList.current).to.equal(sampleList.get(sampleList.length - 1));
        });
    });

    describe('next', () => {

        it('should return next element relative to the current event if nothing passed in', () => {
            let nextIndex = 1;
            let next = sampleList.next();
            let expectedEvent = sampleList.get(nextIndex);
            expect(next.time).to.equal(expectedEvent.time);
        });

        it('should be return next event relative to the passed in event', () => {
            let index = 1;
            let nextIndex = index + 1;

            let event = sampleList.get(index);
            let next = sampleList.next(event);
            let expectedEvent = sampleList.get(nextIndex);
            expect(next).to.equal(expectedEvent);
        });

        it('should not advance the state if the advanceState flag set to false', () =>{
            let index = 1;
            let nextIndex = index + 1;

            let event = sampleList.get(index);
            sampleList.current = event;

            let next = sampleList.next(event, false);
            expect(next).to.equal(sampleList.get(nextIndex));
            expect(sampleList.current).to.equal(event);
        });
    });

    describe('previous', () => {

        it('should return previous element relative to the current event if nothing passed in', () => {
            let index = sampleList.length - 1;
            let previousIndex = index - 1;
            sampleList.current = sampleList.get(index);
            let previous = sampleList.previous();
            expect(previous).to.equal(sampleList.get(previousIndex));
        });

        it('should be return previous event relative to the passed in event', () => {
            let index = 2;
            let previousIndex = index - 1;
            let event = sampleList.get(index);
            let previous = sampleList.previous(event);
            expect(previous).to.equal(sampleList.get(previousIndex));
        });

        it('should not advance the state if the advanceState flag set to false', () =>{
            let index = 2;
            let previousIndex = index - 1;
            let event = sampleList.get(index);
            sampleList.current = event;
            let previous = sampleList.previous(event, false);
            expect(previous).to.equal(sampleList.get(previousIndex));
            expect(sampleList.current).to.equal(sampleList.get(index));
        });
    });

    describe('upperBoundingTime', ()=> {

        it('should return the time of the next event when there is one', () => {
            let index = 1;
            let nextIndex = index + 1;
            sampleList.current = sampleList.get(index);
            let upperBoundingTime = sampleList.upperBoundingTime();
            let expectedTime = sampleList.get(nextIndex).time;
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
