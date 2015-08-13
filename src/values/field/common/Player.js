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
        let isAwayTeam = opposingPlayerIds.indexOf(String(playerId)) >= 0;

        color = isHomeTeam ? angular.copy(game.primaryJerseyColor) : angular.copy(game.opposingPrimaryJerseyColor);
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
            let jerseyNumber = player.isUnknown ? 'U' : angular.copy(rosterEntry.jerseyNumber);

            let value = {
                playerId: angular.copy(player.id),
                jerseyColor: angular.copy(game.primaryJerseyColor),
                jerseyNumber,
                name: '(' + jerseyNumber + ')  ' + angular.copy(player.firstName) + ' ' + angular.copy(player.lastName),
                get order() {
                    if (rosterEntry.isUnknown) {
                        return 1;
                    } else {
                        return Number(jerseyNumber);
                    }
                },
                get type() {
                    return 'Player';
                },
                get id() {
                    return player.id;
                },
                get isActive() {
                    return rosterEntry.isActive;
                }
            };
            return value;
        }).filter(value => value.isActive);

        let opposingTeamPlayersValues = Object.keys(game.rosters[opposingTeam.id].playerInfo).map( (playerId) => {
            let rosterEntry = game.rosters[opposingTeam.id].playerInfo[playerId];
            let player = players.get(playerId);
            let jerseyNumber = player.isUnknown ? 'U' : angular.copy(rosterEntry.jerseyNumber);
            let value = {
                playerId: angular.copy(player.id),
                jerseyColor: angular.copy(game.opposingPrimaryJerseyColor),
                jerseyNumber,
                name: '(' + jerseyNumber + ')  ' + angular.copy(player.firstName) + ' ' + angular.copy(player.lastName),
                get order() {
                    if (rosterEntry.isUnknown) {
                        return 1;
                    } else {
                        return Number(jerseyNumber);
                    }
                },
                get type() {
                    return 'Player';
                },
                get id() {
                    return player.id;
                },
                get isActive() {                    
                    return rosterEntry.isActive;
                }
            };
            return value;
        }).filter(value => value.isActive);
        values =  teamPlayersValues.concat(opposingTeamPlayersValues);
    }

    if (!field.isRequired) {
        values.unshift({playerId: null, jerseyColor: null, jerseyNumber: 'NONE', name: field.name});
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

let common = {
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
