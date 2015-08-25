import FieldController from '../controller';

class PlayerFieldController extends FieldController {

    constructor(scope) {

        super(scope);
    }
}

PlayerFieldController.$inject = [
    '$scope'
];

export default PlayerFieldController;
