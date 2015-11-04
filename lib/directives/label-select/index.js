import directive from './directive';

const angular = window.angular;
const dependencies = [
    'ngMaterial'
];

const KrossoverLabelSelect = angular.module(
    'KrossoverLabelSelect',
    dependencies
);

KrossoverLabelSelect.directive(
    'krossoverLabelSelect',
    directive
);

export default KrossoverLabelSelect;
