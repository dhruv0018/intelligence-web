import PlayList from '../../../src/collections/playList';

const srcArray = [
    {
        startTime: 3052.4299316406
    },
    {
        startTime: 2914.5400390625
    }
];

const srcPlay = {
    startTime: 1052.4299316406
};

describe('PlayList', () => {

    const classMethods = [
        'next',
        'previous'
    ];

    let srcArrayCopy;
    let sampleList;

    beforeEach(() => {

        srcArrayCopy = srcArray.slice(0);
        sampleList   = new PlayList(srcArrayCopy);
    });

    it('should exist.', () => {
        expect(PlayList).to.exist;
    });

    it('should have public API', () => {

        classMethods.forEach(method => expect(PlayList).to.respondTo(method));
    });

    it('should be sorted by startTime', () => {
        let index = 0;
        let startTime = 0;
        while(index < sampleList.length) {
            let play = sampleList.get(index);
            expect(play.startTime).to.be.at.least(startTime);
            startTime = play.startTime;
            index++;
        }
    });

    it('should still be sorted by startTime if a new play is inserted', () => {
        let index = 0;
        let startTime = 0;
        sampleList.add(srcPlay);

        while(index < sampleList.length) {
            let play = sampleList.get(index);
            expect(play.startTime).to.be.at.least(startTime);
            startTime = play.startTime;
            index++;
        }
    });

    it('should be able to retrieve the next play when it exists', () => {
        let firstPlay = sampleList.first;
        let nextPlay = sampleList.next(firstPlay);
        expect(nextPlay.startTime).to.be.at.least(firstPlay.startTime);
    });

    it('should get null when the next play does not exist', () => {
        let firstPlay = sampleList.last;
        let nextPlay = sampleList.next(firstPlay);
        expect(nextPlay).to.be.null;
    });

    it('should be able to retrieve the previous play when it exists', () => {
        let lastPlay = sampleList.last
        let previousPlay = sampleList.previous(lastPlay);
        expect(previousPlay.startTime).to.be.at.most(lastPlay.startTime);
    });

    it('should get null when the previous play does not exist', () => {
        let firstPlay = sampleList.first;
        let previousPlay = sampleList.previous(firstPlay);
        expect(previousPlay).to.be.null;
    });
});
