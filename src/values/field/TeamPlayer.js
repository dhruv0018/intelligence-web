import Field from './Field.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class TeamPlayerField extends Field {
    constructor(field) {

        if (!field) return;
        super(field);

        let injector = angular.element(document).injector();


        let teamPlayerOption = {
            name: !field.isRequired ? 'Optional' : undefined,
            teamId: (!field.isRequired && field.type === 'Team') ? null : undefined,
            playerId: (!field.isRequired && field.type === 'Player') ? null : undefined
        };

        this.players = injector.get('PlayersFactory');
        this.teams = injector.get('TeamsFactory');

        if (field.value) {
            switch(field.type) {
                case 'Player':
                    let player = this.players.get(field.value);
                    teamPlayerOption.name = player.firstName + ' ' + player.lastName;
                    teamPlayerOption.playerId = Number(player.id);
                    break;
                case 'Team':
                    let team = this.teams.get(field.value);
                    teamPlayerOption.name = team.name;
                    teamPlayerOption.teamId = Number(team.id);
                    break;
            }
        }

        this.value = teamPlayerOption;
        this.availableValues = []; //todo blocker
    }

    get currentValue() {
        return this.value;
    }

    set currentValue(teamPlayerOption) {
        let value = {};
        let type = this.type;
        if (!teamPlayerOption && !teamPlayerOption) {
            value = teamPlayerOption;
            this.value = value;
            return;
        }
        switch(this.type) {
            case 'Player':
                let player = this.players.get(teamPlayerOption.playerId);
                value.name = player.firstName + ' ' + player.lastName;
                value.playerId = Number(player.id);
                break;
            case 'Team':
                let team = this.teams.get(teamPlayerOption.teamId);
                value.name = team.name;
                value.teamId = Number(team.id);
                break;
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
