import Entity from './entity';
import FieldFactory from '../values/field/FieldFactory';

/**
 * KrossoverEvent Entity Model
 * @class KrossoverEvent
 */
class KrossoverEvent extends Entity {

    /**
     * @constructs KrossoverEvent
     * @param {Object} event     - Event JSON
     * @param {KrossoverTag} tag - An instantiated KrossoverTag tag
     * @param {Number} time      - The time
     * @param {Number} gameId    - The game ID
     */
    constructor (event, tag, time, gameId) {

        /* If only two parameters are passed, we don't have an event, so
         * reassign values. */
        if (arguments.length === 2) {

            time  = tag;
            tag   = event;
            event = {};
        }

        super(tag);

        this.tagId = tag.id;

        /* TODO: Get rid of this property when indexing service is refactored */
        this.activeEventVariableIndex = event.activeEventVariableIndex || 1;

        this.id     = event.id;
        this.playId = event.playId;
        this.time   = time;

        /* Transform variables */
        Object.keys(this.fields).forEach((order, index) => {

            let variableValue = event.variableValues[this.fields[order].id];

            this.fields[order].gameId    = gameId;
            this.fields[order].inputType = this.fields[order].type;
            this.fields[order].order     = index + 1;

            switch (this.fields[order].inputType) {

            case 'PLAYER_DROPDOWN':
                this.fields[order].currentValue = {

                    playerId: variableValue.value
                };
                break;
            case 'TEAM_DROPDOWN':
                this.fields[order].currentValue = {

                    teamId: variableValue.value
                };
                break;
            case 'PLAYER_TEAM_DROPDOWN':
                this.fields[order].currentValue = {

                    teamId: variableValue.type === 'Team' ? variableValue.value : undefined,
                    playerId: variableValue.type === 'Player' ? variableValue.value : undefined
                };
                break;
            case 'YARD':
                this.fields[order].currentValue = {

                    name: variableValue.value,
                    content: variableValue.value
                };
                break;
            default:
                this.fields[order].currentValue = variableValue.value;
            }

            if (variableValue.type) {

                this.fields[order].type = variableValue.type;
            } else {

                delete this.fields[order].type;
            }
        });
    }

    /**
     * Getter for this.shortcutKey
     *
     * @readonly
     * @type {String}
     */
    get keyboardShortcut () {

        return this.shortcutKey;
    }

    set keyboardShortcut (value) {

        return;
    }

    /**
     * Checks if all the variables have values.
     *
     * @method isValid
     * @returns {Boolean} - true, if all fields are valid; false otherwise.
     */
    isValid () {

        Object.keys(this.fields).forEach(order => {

            if (!this.fields[order].isValid()) {

                return false;
            }
        });

        return true;
    }

    /**
     * Checks whether the event is a floating event.
     *
     * @method isFloat
     * @returns {Boolean} - true if the event is floating event; false otherwise.
     */
    isFloat () {

        return this.isStart === false && this.isEnd === false && this.children && this.children.length === 0;
    }

    /**
     * Checks whether the event is an end-and-start event: is an end tag and
     * only has one child.
     *
     * @method isEndAndStart
     * @returns {Boolean} - true if the event is an end-and-start event; false otherwise.
     */
    isEndAndStart () {

        return this.isEnd && this.children && this.children.length === 1;
    }

    /**
     * Reverts the class instance to JSON suitable for the server.
     *
     * @method toJSON
     * @returns {String} - JSON ready version of the object.
     */
    toJSON () {

        let copy = Object.assign({}, this);

        delete copy.activeEventVariableIndex;
        delete copy.indexerScript;
        delete copy.userScript;
        delete copy.shortcutKey;
        delete copy.description;
        delete copy.isStart;
        delete copy.isEnd;
        delete copy.tagSetId;
        delete copy.children;
        delete copy.pointsAssigned;
        delete copy.assignThisTeam;
        delete copy.isPeriodTag;
        delete copy.summaryPriority;
        delete copy.summaryScript;
        delete copy.buffer;
        delete copy.name;

        copy.variableValues = {};

        Object.keys(copy.fields).forEach(order => {

            copy.variableValues[copy.fields[order].id] = copy.fields[order].toJSON();
        });

        return copy;
    }
}

export default KrossoverEvent;
