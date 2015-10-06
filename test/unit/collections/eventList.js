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
        let index = 0;
        let time = 0;
        for (let event of sampleList) {
            expect(event.value.time).to.be.at.least(time);
            time = event.value.time;
        }
    });

    describe('current', () => {

        it('should be able to get an event', () => {
            expect(sampleList.current).to.equal(srcArrayCopy[0]);
        });

        it('should be able to set an event', () => {
            sampleList.current = srcArrayCopy[1];
            expect(sampleList.current.time).to.equal(srcArrayCopy[1].time);
        });
    });

    describe('next', () => {

        it('should return next element relative to the current event if nothing passed in', () => {
            let next = sampleList.next();
            let expectedEvent = {
                time: 3052.4299316406
            };
            expect(next.time).to.equal(expectedEvent.time);
        });

        it('should be return next event relative to the passed in event', () => {
            let event = srcArrayCopy[2];
            let next = sampleList.next(event);
            let expectedEvent = {
                time: 4252.4299316406
            };
            expect(next.time).to.equal(expectedEvent.time);
        });

        it('should not advance the state if the advanceState flag set to false', () =>{
            let event = srcArrayCopy[2];
            let next = sampleList.next(event, false);
            let expectedEvent = {
                time: 2914.5400390625
            };
            expect(sampleList.current.time).to.equal(expectedEvent.time);
        });
    });

    describe('upperBoundingTime', ()=> {

        it('should return the time of the next event when there is one', () => {
            let upperBoundingTime = sampleList.upperBoundingTime();
            let expectedTime = 3052.4299316406;
            expect(upperBoundingTime).to.equal(expectedTime);
        });

        it('should return null if there is no next event', () => {
            let event = srcArrayCopy[2];
            sampleList.current = event;
            let upperBoundingTime = sampleList.upperBoundingTime(event);
            let expectedTime = null;
            expect(upperBoundingTime).to.be.null;
        });
    });

});
