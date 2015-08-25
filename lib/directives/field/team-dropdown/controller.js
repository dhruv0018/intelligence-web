import FieldController from '../controller';

class TeamFieldController extends FieldController {

    constructor(scope) {

        super(scope);
    }
}

TeamFieldController.$inject = [
    '$scope'
];

export default TeamFieldController;
