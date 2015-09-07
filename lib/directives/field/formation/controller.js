import FieldController from '../controller';

class FormationFieldController extends FieldController {

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

FormationFieldController.$inject = [
    '$scope',
    'PlaylistEventEmitter',
    'EVENT'
];

export default FormationFieldController;
