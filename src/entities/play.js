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
