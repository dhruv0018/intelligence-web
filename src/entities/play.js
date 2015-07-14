import Entity from './entity';
import KrossoverEvent from '../entities/event.js';

/**
 * KrossoverPlay Entity Model
 * @class KrossoverPlay
 */
class KrossoverPlay extends Entity {

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

            let tag = tagsets.getTagJSON(event.tagId);

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

                let indexerScriptHTMLString = event.indexerScript.toString();
                let eventHTMLString = `
                <li class="event">

                    <button class="item btn-select-event" ng-click="selectEvent(${event.id});">

                        ${indexerScriptHTMLString}

                    </button>

                </li>
                `;

                return eventHTMLString;
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

                let summaryScriptHTMLString = event.summaryScript.toString();
                let eventHTMLString = `
                ${summaryScriptHTMLString}
                `;

                return eventHTMLString;
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

            let userScriptHTMLString = event.userScript.toString();
            let eventHTMLString = `
            <li class="event">

                <button class="item btn-select-event" ng-click="selectEvent(${event.id});">

                    ${userScriptHTMLString}

                </button>

            </li>
            `;

            return eventHTMLString;
        });
    }

    toJSON () {

        let copy = Object.assign({}, this);

        delete copy.PAGE_SIZE;
        delete copy.description;
        delete copy.model;
        delete copy.storage;
        delete copy.hasVisibleEvents;
        delete copy.isFiltered;

        copy.events = copy.events.map((event) => {

            return JSON.parse(event.toJSON());
        });

        return JSON.stringify(copy);
    }
}

/**
 * @module KrossoverPlay
 * @exports entities/play
 */
export default KrossoverPlay;
