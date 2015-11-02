import controller from './controller';
import krossoverPrioritySelectTemplate from './template.html';

const template = krossoverPrioritySelectTemplate();

const dependencies = [
];

const KrossoverPrioritySelectDirective = () => {

    return {

        template,
        controller,
        restrict: 'E',
        scope: {
            priority: '=ngModel'
        }
    };
};

KrossoverPrioritySelectDirective.$inject = dependencies;

export default KrossoverPrioritySelectDirective;
