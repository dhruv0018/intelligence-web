SelfEditorController.$inject = [
    'GamesFactory',
    'TeamsFactory'
];

function SelfEditorController (
    games,
    teams
) {
    this.team = teams.get(this.game.teamId);
    this.opposingTeam = teams.get(this.game.opposingTeamId);
    this.video = this.game.video;
    this.posterImage = {
        url: this.game.video.thumbnail
    };
}

export default SelfEditorController;
