import FieldController from '../controller';

class GapFieldController extends FieldController {

    constructor(scope) {

        super(scope);
    }
}

GapFieldController.$inject = [
    '$scope'
];

export default GapFieldController;
