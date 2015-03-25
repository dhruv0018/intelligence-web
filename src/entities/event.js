import Entity from './entity.js';

const model = {

    variableValues: {},
    activeEventVariableIndex: 1
};

class Event extends Entity {

    constructor (event, tag, time) {

        if (!time) {

            time = tag;
            tag = event;
            event = model;
        }

        delete tag.id;

        Object.assign(this, event, tag, { time });
    }
}

export default Event;

