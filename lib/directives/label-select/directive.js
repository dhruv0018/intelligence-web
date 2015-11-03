import controller from './controller';
import template from './template.html';

const dependencies = [
];

/**
 * @param {}
 */
const KrossoverLabelSelectDirective = (
) => {

    return {

        template,
        controller,
        restrict: 'E',
        scope: {
            label: '='
        }
    };
};

KrossoverLabelSelectDirective.$inject = dependencies;

export default KrossoverLabelSelectDirective;
