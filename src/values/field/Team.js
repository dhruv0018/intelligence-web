import Field from './Field.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class TeamField extends Field {
    constructor(field) {

        if (!field) return;
        super(field);

        let teamOption = {
            teamId: (!field.isRequired && field.type === 'Team') ? null : undefined
        };

        if (field.value) teamOption.teamId = field.value;

        this.currentValue = teamOption;

        Object.defineProperty(this.value, 'name', {
            get: () => {
                let calculatedName = !this.isRequired ? 'Optional' : 'Select';
                let value = this.currentValue;
                let teamId = value.teamId;
                let injector = angular.element(document).injector();
                let teams = injector.get('TeamsFactory');
                let team = teams.get(teamId);
                calculatedName = angular.copy(team.name);
                return calculatedName;
            }
        });
    }

    get currentValue() {
        return this.value;
    }

    set currentValue(teamOption) {
        let value = {
            teamId: (teamOption.teamId) ? Number(teamOption.teamId) : teamOption.teamId
        };
        this.value = value;
    }

    toJSON() {
        let variableValue = {};
        let value = (!this.isRequired && this.value.teamId === null) ? null : String(this.value.teamId);
        variableValue = {
            type: 'Team',
            value
        };
        return this.isValid(variableValue) ? JSON.stringify(variableValue) : 'Corrupted ' + this.inputType;
    }
}

export default TeamField;
