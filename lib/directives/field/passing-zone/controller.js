import FieldController from '../controller';

class PassingZoneFieldController extends FieldController {

    constructor(scope) {

        super(scope);
    }
}

PassingZoneFieldController.$inject = [
    '$scope'
];

export default PassingZoneFieldController;
