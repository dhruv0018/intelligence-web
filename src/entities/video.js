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
 *//**
 * Server-assigned index identification number
 * @property {Integer} id
 * @readonly
 * @example 29
 *//**
 * Server assigned globally unique identifer for the Video
 * @property {String} guid
 * @readonly
 * @example "ec2-54-242-131-88.compute-1.amazonaws.com53c563b6bed86"
 *//**
 * (1 = Incomplete, 2 = Uploaded, 3 = Complete, 4 = Failed)
 * @property {Integer} status
 * @example 3
 *//**
 * Available transcode profiles for the Video
 * @property {Array<TranscodeProfile>} transcodeProfiles
 * @readonly
 *//**
 * Available transcode profiles for the Video
 * @property {Array<Object>} videoTranscodeProfiles
 * @deprecated in favor of this.transcodeProfiles
 * @readonly
 *//**
 * Duration of the Video, accuracy to two decimal places
 * @property {Float} duration
 * @readonly
 * @example 6232.68
 *//**
 * Server generated thumbnail URL for the Video
 * @property {String} thumbnail
 * @readonly
 * @example
 * "http:\\/\\/krossover-com-prod-content.
 * cdn.krossover.com\\/images\\/thumbnails\\
 * /ec2-54-242-131-88.compute-1.amazonaws.com53c563b6bed86_3500.jpg"
 *//**
 * Available resourceUrls for Videogular media
 * @property {Array<Object>} resourceUrls
 * @readonly
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

        if (validation.errors.length) {

            throw new Error(validation.errors.shift());
        }

        super(video);

        this.status = this.status || VIDEO_STATUSES.INCOMPLETE.id;

        // Instantiate transcodeProfile entities
        if (this.isComplete() && this.videoTranscodeProfiles) {

            // NOTE: Adding videoTranscodeProfilesByBitrate FIXES A BACKEND BUG
            // WHERE DUPLICATE TRANSCODE PROFILES ARE PRESENT AND REMOVES THEM
            // ON THE FRONTEND.
            // TODO: REMOVE videoTranscodeProfilesByBitrate WHEN BACKEND NO LONGER
            // PRODUCES DUPLICATE VIDEO PROFILES AND A MIGRATION IS COMPLETE.
            let videoTranscodeProfilesByBitrate = {};

            this.videoTranscodeProfiles.forEach(videoTranscodeProfile => {

                let targetBitrate = videoTranscodeProfile.transcodeProfile.targetBitrate;
                if (videoTranscodeProfilesByBitrate[targetBitrate]) return;
                else videoTranscodeProfilesByBitrate[targetBitrate] = videoTranscodeProfile;
            });

            this.videoTranscodeProfiles = Object.keys(videoTranscodeProfilesByBitrate).map(bitrate => {

                let transcodeProfile = videoTranscodeProfilesByBitrate[bitrate];
                return new TranscodeProfile(transcodeProfile);
            });

            this.videoTranscodeProfiles.sort((a, b) => b.targetBitrate - a.targetBitrate);
        }
    }

    /**
     * Serializes Video entity to valid JSON
     * @method Video.toJSON
     * @returns {Object} VideoJSONObject
     */
    toJSON () {

        let copy = Object.assign({}, this);

        if (copy.transcodeProfiles) {

            copy.videoTranscodeProfiles = copy.videoTranscodeProfiles.map(transcodeProfile => JSON.stringify(transcodeProfile));
        }

        return copy;
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

        let validation = tv4.validateMultiple(video, schema);

        return validation;
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
     * Getter for Video.resourceUrls
     * @method Video.resourceUrls
     * @readonly
     * @returns {Array} resourceUrls Array of trusted Resource URLs
     */
    get resourceUrls() {

        return this.transcodeProfiles.map(transcodeProfile => transcodeProfile.resourceUrl);
    }

    /**
     * Business logic for status complete
     * @method isComplete
     * @returns {Boolean} isComplete [true] if video is complete
     */
    isComplete(video = this) {

        return video.status === VIDEO_STATUSES.COMPLETE.id;
    }
}

/**
 * @module Video
 * @exports entities/video
 */
export default Video;
