import FieldController from '../controller';

class TeamPlayerFieldController extends FieldController {

    constructor(scope) {

        super(scope);
    }
}

TeamPlayerFieldController.$inject = [
    '$scope'
];

export default TeamPlayerFieldController;
