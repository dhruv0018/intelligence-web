import FieldController from '../controller';

class DropdownFieldController extends FieldController {

    constructor(scope) {

        super(scope);
    }
}

FieldController.$inject = [
    '$scope'
];

export default DropdownFieldController;
