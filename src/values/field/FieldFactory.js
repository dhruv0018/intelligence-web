import TeamPlayerField from './TeamPlayer';
import GapField from './Gap';
import PassingZoneField from './PassingZone';
import FormationField from './Formation';
import DropdownField from './Dropdown';
import PeriodField from './Period';
import TextField from './Text';
import YardField from './Yard';
import ArenaField from './Arena';
import PlayerField from './Player';
import TeamField from './Team';
import StaticField from './Static';

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

        switch (rawField.type) {

        case 'PLAYER_DROPDOWN':
            return new PlayerField(rawField);
        case 'TEAM_DROPDOWN':
            return new TeamField(rawField);
        case 'PLAYER_TEAM_DROPDOWN':
            return new TeamPlayerField(rawField, variableValueType);
        case 'GAP':
            return new GapField(rawField);
        case 'PASSING_ZONE':
            return new PassingZoneField(rawField);
        case 'FORMATION':
            return new FormationField(rawField);
        case 'DROPDOWN':
            return new DropdownField(rawField);
        case 'PERIOD':
            return new PeriodField(rawField);
        // case 'TEXT':
        //     return new TextField(rawField);
        //todo tech debt
        case 'YARD':
        case 'TEXT':
            return new YardField(rawField);
        case 'ARENA':
            return new ArenaField(rawField);
        case 'STATIC':
            return new StaticField(rawField);
        default:
            return rawField;
        }
    }
}

export default FieldFactory;
