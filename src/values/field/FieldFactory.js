import TeamPlayerField from './TeamPlayer';
import GapField from './Gap';
import PassingZoneField from './PassingZone';
import FormationField from './Formation';
import DropdownField from './Dropdown';
import TextField from './Text';
import YardField from './Yard';
import ArenaField from './Arena';
import PlayerField from './Player';
import TeamField from './Team';

/**
 * FieldFactory Entity Model
 * @class FieldFactory
 * @static
 */
class FieldFactory {

    /**
     * @constructs FieldFactory
     */
    constructor () {

        throw new Error('Cannot instantiate; FieldFactory is a static class!');
    }

    /**
     * Instantiates and returns a Field based on input type.
     *
     * @method createField
     * @static
     * @param {Object}  - Raw field value from server
     * @returns {Field} - Depending on input type.
     */
    static createField (rawField, variableValueType) {

        let field;

        switch (rawField.type) {

        case 'PLAYER_DROPDOWN':
            field = new PlayerField(rawField);
            break;
        case 'TEAM_DROPDOWN':
            field = new TeamField(rawField);
            break;
        case 'PLAYER_TEAM_DROPDOWN':
            field = new TeamPlayerField(rawField, variableValueType);
            break;
        case 'GAP':
            field = new GapField(rawField);
            break;
        case 'PASSING_ZONE':
            field = new PassingZoneField(rawField);
            break;
        case 'FORMATION':
            field = new FormationField(rawField);
            break;
        case 'DROPDOWN':
            field = new DropdownField(rawField);
            break;
        // case 'TEXT':
        //     field = new TextField(rawField);
        //     break;
        //todo tech debt
        case 'YARD':
        case 'TEXT':
            field = new YardField(rawField);
            break;
        case 'ARENA':
            field = new ArenaField(rawField);
            break;
        default:
            field = rawField;
        }

        return field;
    }
}

export default FieldFactory;
