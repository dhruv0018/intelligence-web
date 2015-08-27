import FieldController from '../controller';

class DropdownFieldController extends FieldController {

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

FieldController.$inject = [
    '$scope',
    'PlaylistEventEmitter',
    'EVENT'
];

export default DropdownFieldController;
