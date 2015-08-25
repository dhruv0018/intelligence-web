

function name(field, teamId) {
    let calculatedName = field.name;
    if (teamId && window && window.angular && document) {
        let injector = angular.element(document).injector();
        if (injector) {
            let teams = injector.get('TeamsFactory');
            let team = teams.get(teamId);
            calculatedName = team.name;
        }
    }
    return calculatedName;
}

function availableValues(field) {
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
                color: (localTeam.id === game.teamId) ? game.primaryJerseyColor : game.opposingPrimaryJerseyColor,
                //so they are placed at highest priority
                get order() {
                    return -1;
                },
                get type() {
                    return 'Team';
                },
                get id() {
                    return localTeam.id;
                }
            };
        });
    }

    if (!field.isRequired) {
        values.unshift({teamId: null, name: field.name, color: null});
    }
    return values;
}

let common = {
    getters: {
        availableValues,
        name
    }
};

export default common;
