import Entity from './entity';
import TranscodeProfile from './transcodeProfile';
import { TRANSCODE_PROFILE_IDS, TRANSCODE_PROFILES } from '../constants/transcodeProfiles';

/**
 * Video statuses constant
 * @const {Object} VIDEO_STATUSES
 */
import { VIDEO_STATUSES } from '../constants/videos';

/**
 * tv4 3rd party JSON validation library
 * @const {Object} tv4
 */
const tv4 = require('tv4');

/**
 * Video object JSON schema
 * @const {Object} schema
 */
const schema = require('../../schemas/video.json');

/**
 * How to use Video entity
 * @example
 * let VideoJSONObject = {
 *     "id": 354704,
 *     "guid": "ec2-23-20-153-60.compute-1.amazonaws.com544e904aa6998",
 *     "status": 4,
 *     "videoTranscodeProfiles": [...TranscodeProfileEntities],
 *     "duration": 3710,
 *     "thumbnail": "http:\/\/krossover-com-prod-content.cdn.krossover.com\/images\/thumbnails\/ec2-23-20-153-60.compute-1.amazonaws.com544e904aa6998_1600.jpg"
 * }
 * let video = new Video(VideoJSONObject);
 * // Use accessor methods
 * if (video.status === VIDEO_STATUSES.UPLOADED.id) {...}
 * for (transcodeProfiles in video.transcodeProfiles) {...}
 */

/**
 * Video Entity Model
 * @class Video
 */
class Video extends Entity {

    /**
     * Instantiates new Video entity
     * @constructor
     * @param {Object} VideoJSONObject (req)
     * @returns {Video} Video entity
     */
    constructor (video) {

        switch (arguments.length) {

            case 0:

                throw new Error('Invoking Video.constructor without passing a JSON object');
        }

        let validation = this.validate(video);

        // FIXME: ValidationError: Invalid type: object (expected Object)
        // if (validation.errors.length) {

        //     throw new Error(validation.errors.shift());
        // }

        video.status = video.status || VIDEO_STATUSES.INCOMPLETE.id;

        // Instantiate transcodeProfile entities
        if (this.videoIsComplete(video) && video.videoTranscodeProfiles) {

            video.videoTranscodeProfiles = video.videoTranscodeProfiles.map(transcodeProfile => new TranscodeProfile(transcodeProfile));
            video.currentTranscodeProfile = video.videoTranscodeProfiles.sort((a, b) => b.transcodeProfileId - a.transcodeProfileId)[0];
        }


        return this.extend(video);
    }

    /**
    * Checks a video JSON object for valid properties
    * @method Video.validate
    * @param {Object} VideoJSONObject [req]
    * @returns {Boolean} validated [true] if valid object
    */
    validate (video) {

        switch (arguments.length) {

            case 0:

                throw new Error('Invoking Video.validate without passing a JSON object');
        }

        let validation =  tv4.validateMultiple(video, schema);

        return validation;
    }

    /**
     * Getter for Video.id
     * @method Video.id
     * @readonly
     * @returns {Integer} id
     */
    get id() {

        return this.id;
    }

    /**
     * Getter for Video.guid
     * @method Video.guid
     * @readonly
     * @returns {String} guid
     */
    get guid() {

        return this.guid;
    }

    /**
     * Getter for Video.status
     * @method Video.status
     * @readonly
     * @returns {Integer} status
     */
    get status() {

        return this.status;
    }

    /**
     * Getter for Video.videoTranscodeProfiles
     * @method Video.videoTranscodeProfiles
     * @returns {Array} transcodeProfiles array of entities
     */
    get transcodeProfiles() {

        return this.videoTranscodeProfiles;
    }

    /**
     * Setter for Video.videoTranscodeProfiles
     * @method Video.videoTranscodeProfiles
     * @param {Array} transcodeProfiles array of transcodeProfiles
     */
    set transcodeProfiles(transcodeProfiles) {

        this.videoTranscodeProfiles = transcodeProfiles;
    }

    /**
     * Getter for Video.duration
     * @method Video.duration
     * @readonly
     * @returns {Integer} duration
     */
    get duration() {

        // Seconds
        return this.duration;
    }

    /**
     * Getter for Video.thumbnail
     * @method Video.thumbnail
     * @readonly
     * @returns {String} thumbnail
     */
    get thumbnail() {

        return this.thumbnail;
    }

    /**
     * Getter for Video.quality
     * @method Video.quality
     * @readonly
     * @returns {String} quality descriptor
     */
    get quality() {

        // TODO: Improve readability
        return this.currentTranscodeProfile ?
            TRANSCODE_PROFILES[TRANSCODE_PROFILE_IDS[this.currentTranscodeProfile.transcodeProfileId]].title :
            undefined;
    }

    /**
     * Getter for Video.url
     * @method Video.url
     * @readonly
     * @returns {String} url source URL
     */
    get url() {

        return this.currentTranscodeProfile ?
            this.currentTranscodeProfile.url :
            undefined;
    }

    /**
     * Business logic for status complete
     * @method videoIsComplete
     * @returns {Boolean} videoIsComplete [true] if video is complete
     */
    videoIsComplete(video = this) {

        return video.status === VIDEO_STATUSES.COMPLETE.id;
    }
}

/**
 * @module Video
 * @exports entities/video
 */
export default Video;
