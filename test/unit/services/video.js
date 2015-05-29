const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

// TODO: Run Traceur in unit tests
import Video from '../src/entities/video';

describe('Video', () => {

    beforeEach(angular.mock.module('intelligence-web-client'));

    const videoJSONObject = {
        "id": 354704,
        "guid": "ec2-23-20-153-60.compute-1.amazonaws.com544e904aa6998",
        "status": 4,
        "videoTranscodeProfiles": [
        {
            "id": 1544085,
            "videoId": 354704,
            "transcodeProfile": {
                "id": 1,
                "targetBitrate": 600,
                "maximumBitrate": 800,
                "minimumBitrate": 0,
                "description": "SD Low Resolution (360p)",
                "targetDisplayWidth": 640,
                "targetDisplayHeight": 360,
                "aspectRatio": "16:9"
            },
            "status": 4,
            "videoUrl": "http:\\/\\/krossover-com-prod-content.cdn.krossover.com\\/videos\\/finished\\/ec2-23-20-153-60.compute-1.amazonaws.com544e904aa6998_600.mp4"
        },
        {
            "id": 1544086,
            "videoId": 354704,
            "transcodeProfile": {
                "id": 2,
                "targetBitrate": 1600,
                "maximumBitrate": 1900,
                "minimumBitrate": 1000,
                "description": "SD High Resolution (480p)",
                "targetDisplayWidth": 848,
                "targetDisplayHeight": 480,
                "aspectRatio": "16:9"
            },
            "status": 4,
            "videoUrl": "http:\\/\\/krossover-com-prod-content.cdn.krossover.com\\/videos\\/finished\\/ec2-23-20-153-60.compute-1.amazonaws.com544e904aa6998_1600.mp4"
        }
        ],
        "duration": 3710,
        "thumbnail": "http:\\/\\/krossover-com-prod-content.cdn.krossover.com\\/images\\/thumbnails\\/ec2-23-20-153-60.compute-1.amazonaws.com544e904aa6998_1600.jpg"
    };

    const video = new Video(videoJSONObject);

    it('should exist', inject(video => {

        expect(video).to.exist;
    }));

    it('should have a public API', inject(video => {

        expect(video).to.respondTo('id');
        expect(video).to.respondTo('guid');
        expect(video).to.respondTo('status');
        expect(video).to.respondTo('transcodeProfiles');
        expect(video).to.respondTo('duration');
        expect(video).to.respondTo('thumbnail');
        expect(video).to.respondTo('resourceUrl');
        expect(video).to.respondTo('resourceUrls');
    }));
});
