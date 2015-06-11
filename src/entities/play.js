import Entity from './entity';
import KrossoverEvent from '../entities/event.js';

/**
 * KrossoverPlay Entity Model
 * @class KrossoverPlay
 */
class KrossoverPlay extends Entity {

    constructor (play, tagsets) {

        super(play);

        switch (arguments.length) {

            case 0:

                throw new Error('Invoking Play.constructor without passing a JSON object');
        }

        play.events               = play.events || [];
        play.period               = play.period || 0;
        play.indexedScore         = play.indexedScore || 0;
        play.opposingIndexedScore = play.opposingIndexedScore || 0;

        /* Indicates if the play has visible events; set by the events. */
        play.hasVisibleEvents = false;

        /* Play possesion; filled in by the events. */
        play.possessionTeamId = play.possessionTeamId || null;

        play.events = play.events.map(constructEvent);

        function constructEvent (event) {

            let tag = tagsets.getTag(event.tagId);

            return new KrossoverEvent(event, tag, event.time);
        }

        return this.extend(play);
    }

    toJSON () {

        let copy = Object.assign({}, this);

        delete copy.PAGE_SIZE;
        delete copy.description;
        delete copy.model;
        delete copy.storage;
        delete copy.hasVisibleEvents;
        delete copy.isFiltered;

        copy.events = copy.events.map(unextendEvent);

        function unextendEvent (event) {

            return JSON.stringify(event);
        }

        return copy;
    }
}

/**
 * @module KrossoverPlay
 * @exports entities/play
 */
export default KrossoverPlay;
