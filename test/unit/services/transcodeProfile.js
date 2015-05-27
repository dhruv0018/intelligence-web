const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

describe('Video', () => {

    beforeEach(angular.mock.module('intelligence-web-client'));

    it('should exist', inject(TranscodeProfile => {

        expect(TranscodeProfile).to.exist;
    }));

    it('should have a public API', inject(TranscodeProfile => {

        expect(TranscodeProfile).to.respondTo('id');
        expect(TranscodeProfile).to.respondTo('videoId');
        expect(TranscodeProfile).to.respondTo('targetBitrate');
        expect(TranscodeProfile).to.respondTo('maximumBitrate');
        expect(TranscodeProfile).to.respondTo('minimumBitrate');
        expect(TranscodeProfile).to.respondTo('targetDisplayWidth');
        expect(TranscodeProfile).to.respondTo('targetDisplayHeight');
        expect(TranscodeProfile).to.respondTo('aspectRatio');
        expect(TranscodeProfile).to.respondTo('status');
        expect(TranscodeProfile).to.respondTo('url');
        expect(TranscodeProfile).to.respondTo('resourceUrl');
    }));
});
