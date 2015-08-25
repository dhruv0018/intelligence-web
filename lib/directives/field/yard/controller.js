import FieldController from '../controller';

class YardFieldController extends FieldController {

    constructor(scope) {

        super(scope);
    }
}

YardFieldController.$inject = [
    '$scope'
];

export default YardFieldController;
