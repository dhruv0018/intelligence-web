import directive from './directive';

const angular = window.angular;
const dependencies = [
    'ngMaterial'
];

const KrossoverPrioritySelect = angular.module(
    'KrossoverPrioritySelect',
    dependencies
);

KrossoverPrioritySelect.directive(
    'krossoverPrioritySelect',
    directive
);

export default KrossoverPrioritySelect;
