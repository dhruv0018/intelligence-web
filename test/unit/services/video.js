const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

describe('Video', () => {

    beforeEach(angular.mock.module('intelligence-web-client'));

    it('should exist', inject(Video => {

        expect(Video).to.exist;
    }));

    it('should have a public API', inject(Video => {

        expect(Video).to.respondTo('id');
        expect(Video).to.respondTo('guid');
        expect(Video).to.respondTo('status');
        expect(Video).to.respondTo('transcodeProfiles');
        expect(Video).to.respondTo('duration');
        expect(Video).to.respondTo('thumbnail');
        expect(Video).to.respondTo('quality');
        expect(Video).to.respondTo('url');
        expect(Video).to.respondTo('resourceUrl');
        expect(Video).to.respondTo('resourceUrls');
    }));
});
