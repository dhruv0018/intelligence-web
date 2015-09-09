import FieldController from '../controller';

class PlayerFieldController extends FieldController {

    constructor (
        scope,
        playlistEventEmitter,
        EVENT
    ) {

        super(
            scope,
            playlistEventEmitter,
            EVENT
        );
    }
}

PlayerFieldController.$inject = [
    '$scope',
    'PlaylistEventEmitter',
    'EVENT'
];

export default PlayerFieldController;
