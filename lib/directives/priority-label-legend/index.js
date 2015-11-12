import directive from './directive';
import controller from './controller';

const angular = window.angular;
const dependencies = [
    'ngMaterial'
];

const PriorityLabelLegend = angular.module(
    'PriorityLabelLegend',
    dependencies
);

PriorityLabelLegend.directive(
    'priorityLabelLegend',
    directive
);

PriorityLabelLegend.controller(
    'PriorityLabelLegend.controller',
    controller
);

export default PriorityLabelLegend;
