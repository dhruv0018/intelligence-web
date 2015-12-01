SelfEditorController.$inject = [
];

function SelfEditorController (
) {
    this.video = this.game.video;
    this.posterImage = {
        url: this.game.video.thumbnail
    };
}

export default SelfEditorController;
