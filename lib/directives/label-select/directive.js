import controller from './controller';
import krossoverLabelSelectTemplate from './template.html';

const template = krossoverLabelSelectTemplate();

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
            label: '=ngModel'
        }
    };
};

KrossoverLabelSelectDirective.$inject = dependencies;

export default KrossoverLabelSelectDirective;
