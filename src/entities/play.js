import Entity from './entity';
import template from './event/template';
import KrossoverEvent from './event/index';

const schema = require('../../schemas/play.json');

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

        /* Validate event JSON */
        /* TODO: Re-enable this at some point. Right now, far too many
         * plays are failing validtion and polluting the console. */
        // let validation = this.validate(play, schema);
        //
        // if (validation.errors.length) {
        //
        //     console.warn(validation.errors.shift());
        // }

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
     * Getter returns an HTML string of the indexer script for the play.
     *
     * @readonly
     * @type {String} - HTML
     */
    get indexerScript () {

        return this.events.map(event => {

            if (event.indexerScript) {

                let indexerScriptHTMLString = event.indexerFields.toString();
                return template(event, indexerScriptHTMLString);
            }
        });
    }

    /**
     * Getter returns an HTML string of the summary script for the play.
     *
     * @readonly
     * @type {String} - HTML
     */
    get summaryScript () {

        return this.events.map(event => {

            if (event.summaryFields) {

                return event;
            }
        })
        .filter(Boolean)
        .sort((a, b) => b.summaryPriority - a.summaryPriority)
        .slice(0, 2)
        .map(event => event.summaryHTML + '</br>')
        .join('');
    }

    /**
     * Getter returns an HTML string of the user script for the play.
     *
     * @readonly
     * @type {String} - HTML
     */
    get userScript () {

        return this.events.map(event => {

            let userScriptHTMLString = event.userFields.toString();
            return template(event, userScriptHTMLString);
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

        copy.events = copy.events.map(event => event.toJSON());

        return copy;
    }
}

/**
 * @module KrossoverPlay
 * @exports entities/play
 */
export default KrossoverPlay;
