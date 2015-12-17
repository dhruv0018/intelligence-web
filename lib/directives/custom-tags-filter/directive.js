import template from './template.html';
import controller from './controller';

function CustomTagsFilterDirective() {

    const restrict = 'E';
    const scope = {
        plays: '=',
        game: '='
    };

    return {

        restrict,
        scope,
        template,
        controller
    };
}

export default CustomTagsFilterDirective;
