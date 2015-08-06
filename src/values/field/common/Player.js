//TODO many of these will be removable IF we get server delivering names on variableValues
let angular = window.angular;

function name(field, playerId) {
    let calculatedName = field.name;
    if (playerId && window && window.angular && document) {
        let injector = angular.element(document).injector();
        let players = injector.get('PlayersFactory');
        let player = players.get(playerId);
        calculatedName = player.firstName + ' ' + player.lastName;
    }
    return calculatedName;
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
                }
            };
            return value;
        });

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
                }
            };
            return value;
        });
        values =  teamPlayersValues.concat(opposingTeamPlayersValues);
    }

    if (!field.isRequired) {
        values.unshift({playerId: null, jerseyColor: null, jerseyNumber: 'NONE', name: field.name});
    }

    return values;
}

function toString(field) {
    let value = field.value;
    return `
    <span class="value">

        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16px" height="16px" viewbox="0 0 16 16">
            <rect fill="${value.jerseyColor}" stroke="black" stroke-width="${value.jerseyColor === '#ffffff' ? 1 : 0}" x="0" y="0" width="16px" height="16px" />
        </svg>

        <span class="player-name">${value.name}</span>

    </span>
    `;
}

let common = {
    getters: {
        name,
        availableValues
    },
    functionality: {
        toString
    }
};

export default common;
