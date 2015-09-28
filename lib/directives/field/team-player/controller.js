import FieldController from '../controller';

class TeamPlayerFieldController extends FieldController {

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

TeamPlayerFieldController.$inject = [
    '$scope',
    'PlaylistEventEmitter',
    'EVENT'
];

export default TeamPlayerFieldController;
