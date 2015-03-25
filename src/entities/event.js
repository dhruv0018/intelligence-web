import Entity from './entity.js';

class Event extends Entity {

    constructor(event, tag, time) {

        if (!time) {

            time = tag;
            tag = event;
            event = {};
        }

        delete tag.id;

        Object.assign(this, event, tag, { time });
    }
}

export default Event;

