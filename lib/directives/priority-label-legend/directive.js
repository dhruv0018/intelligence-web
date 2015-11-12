import template from './template.html';
import controller from './controller';

const dependencies = [
];

const PriorityLabelLegendDirective = () => {

    return {

        template,
        controller,
        restrict: 'E'
    };
};

PriorityLabelLegendDirective.$inject = dependencies;

export default PriorityLabelLegendDirective;
