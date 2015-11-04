import controller from './controller';
import template from './template.html';

const dependencies = [
];

const KrossoverPrioritySelectDirective = () => {

    return {

        template,
        controller,
        restrict: 'E',
        scope: {
            priority: '='
        }
    };
};

KrossoverPrioritySelectDirective.$inject = dependencies;

export default KrossoverPrioritySelectDirective;
