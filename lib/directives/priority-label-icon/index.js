import directive from './directive';
import controller from './controller';

const angular = window.angular;
const dependencies = [
    'ngMaterial'
];

const PriorityLabelIcon = angular.module(
    'PriorityLabelIcon',
    dependencies
);

PriorityLabelIcon.directive(
    'PriorityLabelIcon',
    directive
);

PriorityLabelIcon.controller(
    'PriorityLabelIcon.controller',
    controller
);

export default PriorityLabelIcon;
