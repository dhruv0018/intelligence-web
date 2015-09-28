import EventList from '../../../src/collections/EventList';

const srcArray = [
    {
        time: 3052.4299316406
    },
    {
        time: 2914.5400390625
    }
];

const srcEvent = {
    time: 1052.4299316406
};

describe('EventList', () => {
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
        while(sampleList.next()) {
            let event = sampleList.current;
            expect(event.time).to.be.at.least(time);
            time = event.time;
        }
    });
});
