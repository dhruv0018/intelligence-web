//TODO many of these will be removable IF we get server delivering names on variableValues
let angular = window.angular;

function playerName(field, playerId) {
    let calculatedName = !field.isRequired ? 'Optional' : field.name;
    if (playerId && window && window.angular && document) {
        let injector = angular.element(document).injector();
        let players = injector.get('PlayersFactory');
        let player = players.get(playerId);
        calculatedName = player.firstName + ' ' + player.lastName;
    }
    return calculatedName;
}

function playerValues(field) {
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
                name: '(' + jerseyNumber + ')  ' + angular.copy(player.firstName) + ' ' + angular.copy(player.lastName)
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
                name: '(' + jerseyNumber + ')  ' + angular.copy(player.firstName) + ' ' + angular.copy(player.lastName)
            };
            return value;
        });
        values =  teamPlayersValues.concat(opposingTeamPlayersValues);
    }

    if (!field.isRequired) {
        values.unshift({playerId: null, jerseyColor: null, jerseyNumber: 'NONE', name: 'Optional'});
    }

    return values;
}

function teamName(field, teamId) {
    let calculatedName = !field.isRequired ? 'Optional' : field.name;
    if (teamId && window && window.angular && document) {
        let injector = angular.element(document).injector();
        if (injector) {
            let teams = injector.get('TeamsFactory');
            let team = teams.get(teamId);
            calculatedName = angular.copy(team.name);
        }
    }
    return calculatedName;
}

function teamValues(field) {
    let values = [];
    let injector = angular.element(document).injector();
    if (injector) {
        let games = injector.get('GamesFactory');
        let teams = injector.get('TeamsFactory');

        let game = games.get(field.gameId);
        let team = game.teamId ? teams.get(game.teamId) : null;
        let opposingTeam = game.opposingTeamId ? teams.get(game.opposingTeamId) : null;

        values = [team, opposingTeam].map((localTeam) => {
            return {
                teamId: localTeam.id,
                name: localTeam.name,
                color: (localTeam.id === game.teamId) ? game.primaryJerseyColor : game.opposingPrimaryJerseyColor
            };
        });
    }

    if (!field.isRequired) {
        values.unshift({teamId: null, name: 'Optional', color: null});
    }
    return values;
}

function teamPlayerValues(field) {
    return teamValues(field).concat(playerValues(field));
}

let getters = {
    playerName,
    playerValues,
    teamName,
    teamValues,
    teamPlayerValues
};

export default getters;
