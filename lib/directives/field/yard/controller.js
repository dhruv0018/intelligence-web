import FieldController from '../controller';

class YardFieldController extends FieldController {

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

YardFieldController.$inject = [
    '$scope',
    'PlaylistEventEmitter',
    'EVENT'
];

export default YardFieldController;
