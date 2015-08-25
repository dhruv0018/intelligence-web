//TODO many of these will be removable IF we get server delivering names on variableValues
let angular = window.angular;

function name(field, playerId) {
    let calculatedName = field.name;
    if (playerId && window && window.angular && document) {
        let injector = angular.element(document).injector();
        let players = injector.get('PlayersFactory');
        let player = players.get(playerId);
        let number = jerseyNumber(field, playerId);
        calculatedName = '(' + number + ') ' + player.firstName + ' ' + player.lastName;
    }
    return calculatedName;
}

function jerseyColor(field, playerId) {
    let color = '#000000';
    let injector = angular.element(document).injector();
    if (playerId && window && window.angular && document) {

        let games = injector.get('GamesFactory');
        let teams = injector.get('TeamsFactory');
        let game = games.get(field.gameId);

        let teamRoster = game.rosters[game.teamId];
        let opposingTeamRoster = game.rosters[game.opposingTeamId];

        let playerIds = Object.keys(teamRoster.playerInfo);
        let opposingPlayerIds = Object.keys(opposingTeamRoster.playerInfo);

        let isHomeTeam = playerIds.indexOf(String(playerId)) >= 0;

        color = isHomeTeam ? game.primaryJerseyColor : game.opposingPrimaryJerseyColor;
    }
    return color;
}

function jerseyNumber(field, playerId) {
    let number = 0;
    let injector = angular.element(document).injector();
    if (playerId && window && window.angular && document) {
        let games = injector.get('GamesFactory');
        let teams = injector.get('TeamsFactory');
        let game = games.get(field.gameId);
        let teamRoster = game.rosters[game.teamId];
        let playerIds = Object.keys(teamRoster.playerInfo);

        if (playerIds.indexOf(String(playerId)) >= 0) {
            let playerInfo = teamRoster.playerInfo[playerId];
            number = playerInfo.jerseyNumber;
        } else {
            let opposingTeamRoster = game.rosters[game.opposingTeamId];
            let playerInfo = opposingTeamRoster.playerInfo[playerId];
            number = playerInfo.jerseyNumber;
        }
    }
    return number === '' ? 'U': number;
}

class PlayerValue {
    constructor(field, playerId, rosterEntry = null) {
        this.rosterEntry = rosterEntry;
        this.playerId = playerId;
        this.field = field;
    }
    get name() {
        return name(this.field, this.playerId);
    }
    get jerseyNumber() {
        return jerseyNumber(this.field, this.playerId);
    }
    get jerseyColor(){
        return jerseyColor(this.field, this.playerId);
    }
    get order() {
        if (this.rosterEntry && this.rosterEntry.isUnknown) {
            return 1;
        } else {
            return Number(this.jerseyNumber);
        }
    }
    get type() {
        return 'Player';
    }
    get id() {
        return this.playerId;
    }
    get isActive() {
        return this.rosterEntry && this.rosterEntry.isActive ? this.rosterEntry.isActive : false;
    }
}


function availableValues(field) {
    let injector = angular.element(document).injector();
    let values = [];
    if (window && injector && document && window.angular) {
        let games = injector.get('GamesFactory');
        let teams = injector.get('TeamsFactory');
        let players = injector.get('PlayersFactory');

        let game = games.get(field.gameId);
        let team = game.teamId ? teams.get(game.teamId) : null;
        let opposingTeam = game.opposingTeamId ? teams.get(game.opposingTeamId) : null;

        let teamPlayersValues = Object.keys(game.rosters[team.id].playerInfo).map( (playerId) => {
            let rosterEntry = game.rosters[team.id].playerInfo[playerId];
            let player = players.get(playerId);
            return new PlayerValue(field, player.id, rosterEntry);
        }).filter(value => value.isActive);

        let opposingTeamPlayersValues = Object.keys(game.rosters[opposingTeam.id].playerInfo).map( (playerId) => {
            let rosterEntry = game.rosters[opposingTeam.id].playerInfo[playerId];
            let player = players.get(playerId);
            return new PlayerValue(field, player.id, rosterEntry);
        }).filter(value => value.isActive);

        values =  teamPlayersValues.concat(opposingTeamPlayersValues);
    }

    if (!field.isRequired) {
        values.unshift(new PlayerValue(field, null));
    }

    return values;
}

function toString(field) {
    let value = field.value;
    let jerseyColor = value.jerseyColor;
    let name = value.name;
    let strokeWidth = value.jerseyColor === '#ffffff' ? 1 : 0;
    return `
    <span class="value">

        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16px" height="16px" viewbox="0 0 16 16">
            <rect fill="${jerseyColor}" stroke="black" stroke-width="${strokeWidth}" x="0" y="0" width="16px" height="16px" />
        </svg>

        <span class="player-name">${name}</span>

    </span>
    `;
}

//exporting common functions that are used between the player and team player fields
//TODO maybe refactor into a class
let common = {
    value: PlayerValue,
    getters: {
        name,
        availableValues,
        jerseyColor
    },
    functionality: {
        toString
    }
};

export default common;
