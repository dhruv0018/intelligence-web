import FieldController from '../controller';

class GapFieldController extends FieldController {

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

GapFieldController.$inject = [
    '$scope',
    'PlaylistEventEmitter',
    'EVENT'
];

export default GapFieldController;
