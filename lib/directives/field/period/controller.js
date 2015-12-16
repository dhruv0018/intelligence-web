import FieldController from '../controller';

class PeriodFieldController extends FieldController {

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

export default PeriodFieldController;
