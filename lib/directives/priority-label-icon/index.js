import directive from './directive';
import controller from './controller';

const angular = window.angular;
const dependencies = [
    'ngMaterial'
];

const KrossoverPriorityLabelIcon = angular.module(
    'KrossoverPriorityLabelIcon',
    dependencies
);

KrossoverPriorityLabelIcon.directive(
    'krossoverPriorityLabelIcon',
    directive
);

KrossoverPriorityLabelIcon.controller(
    'KrossoverPriorityLabelIcon.controller',
    controller
);

export default KrossoverPriorityLabelIcon;
