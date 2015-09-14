import FieldController from '../controller';

class PassingZoneFieldController extends FieldController {

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

PassingZoneFieldController.$injzect = [
    '$scope',
    'PlaylistEventEmitter',
    'EVENT'
];

export default PassingZoneFieldController;
