const templateUrl = 'self-editor/template.html';
import controller from './controller';
const restrict = 'E';

const scope = {

};

const definition = {
    restrict,
    templateUrl,
    controller,
    scope
};

export default () => definition;