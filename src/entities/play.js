import Entity from './entity';
import KrossoverEvent from '../entities/event';
import eventTemplate from './eventTemplate';

/**
 * KrossoverPlay Entity Model
 * @class KrossoverPlay
 */
class KrossoverPlay extends Entity {

    /**
     * @constructs KrossoverPlay
     * @param {Object} play - Play JSON from server
     * @param {Service} tagsets - Tagsets factory
     */
    constructor (play, tagsets) {

        if (!arguments.length) {

            throw new Error('Invoking KrossoverPlay.constructor without passing a JSON object');
        }

        super(play);

        /* If play has no events, set it to an empty array */
        this.events               = play.events || [];

        this.period               = play.period || 0;

        this.indexedScore         = play.indexedScore || 0;
        this.opposingIndexedScore = play.opposingIndexedScore || 0;

        /* If play has no custom tags, set it to an empty array */
        this.customTagIds         = play.customTagIds || [];

        /* Indicates if the play has visible events; set by the events. */
        this.hasVisibleEvents     = false;

        /* Play possesion; filled in by the events. */
        this.possessionTeamId     = play.possessionTeamId || null;

        this.events = this.events.map(event => {

            let tag = tagsets.getTag(event.tagId);

            return new KrossoverEvent(event, tag, event.time, this.gameId);
        });
    }

    /**
     * Method returns an HTML string of the indexer script for the play.
     *
     * @function indexerScript
     * @returns {String} - HTML
     */
    indexerScript () {

        return this.events.map((event, index) => {

            if (event.indexerScript) {

                let indexerScriptHTMLString = event.indexerFields.toString();
                return eventTemplate(event, indexerScriptHTMLString);
            }
        });
    }

    /**
     * Method returns an HTML string of the summary script for the play.
     *
     * @function summaryScript
     * @returns {String} - HTML
     */
    summaryScript () {

        return this.events.map((event, index) => {

            if (event.summaryScript) {

                return event.summaryFields.toString();
            }
        })
        .filter(Boolean);
    }

    /**
     * Method returns an HTML string of the user script for the play.
     *
     * @function userScript
     * @returns {String} - HTML
     */
    userScript () {

        return this.events.map((event, index) => {

            let userScriptHTMLString = event.userFields.toString();
            return eventTemplate(event, userScriptHTMLString);
        });
    }

    /**
     * Reverts the class instance to JSON suitable for the server.
     *
     * @method toJSON
     * @returns {String} - Stringified version of the object.
     */
    toJSON () {

        let copy = Object.assign({}, this);

        delete copy.PAGE_SIZE;
        delete copy.description;
        delete copy.model;
        delete copy.storage;
        delete copy.hasVisibleEvents;
        delete copy.isFiltered;

        copy.events = copy.events.map(event => {

            return event.toJSON();
        });

        return JSON.stringify(copy);
    }
}

/**
 * @module KrossoverPlay
 * @exports entities/play
 */
export default KrossoverPlay;
