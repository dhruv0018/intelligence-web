import Field from './Field.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class TeamPlayerField extends Field {
    constructor(field) {

        if (!field) return;
        super(field);

        let injector = angular.element(document).injector();

        //set up basic value for tag field
        let value = {
            name: !field.isRequired ? 'Optional' : undefined,
            teamId: (field.isRequired && field.type === 'Team') ? null : undefined,
            playerId: (field.isRequired && field.type === 'Player') ? null : undefined
        };

        //if the value is set on the field
        if (field.value) {
            switch(field.type) {
                case 'Player':
                    let players = injector.get('PlayersFactory');
                    let player = players.get(field.value);
                    value.name = player.firstName + ' ' + player.lastName;
                    value.playerId = Number(player.id);
                    break;
                case 'Team':
                    let teams = injector.get('TeamsFactory');
                    let team = teams.get(field.value);
                    value.name = team.name;
                    value.teamId = Number(team.id);
                    break;
            }
        }

        this.value = value;

    }

    toJSON() {

        let variableValue = {
            type: this.type
        };

        switch(variableValue.type) {
            case 'Player':
                variableValue.value = this.value.playerId;
                break;
            case 'Team':
                variableValue.value = this.value.teamId;
                break;
        }

        return this.isValid(variableValue) ? JSON.stringify(variableValue) : 'Corrupted ' + this.inputType;
    }
}

export default TeamPlayerField;
