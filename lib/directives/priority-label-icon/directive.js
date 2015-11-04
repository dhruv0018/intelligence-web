import template from './template.html';
import controller from './controller';

const dependencies = [
];

const PriorityLabelIconDirective = () => {

    return {

        template,
        controller,
        restrict: 'E',
        scope: {

            priority: '='
        }
    };
};

PriorityLabelIconDirective.$inject = dependencies;

export default PriorityLabelIconDirective;
