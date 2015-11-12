import template from './template.html';
import controller from './controller';

const dependencies = [
];

const KrossoverPriorityLabelIconDirective = () => {

    return {

        template,
        controller,
        restrict: 'E',
        scope: {

            priority: '='
        }
    };
};

KrossoverPriorityLabelIconDirective.$inject = dependencies;

export default KrossoverPriorityLabelIconDirective;
