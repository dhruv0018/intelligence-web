import directive from './directive';

const angular = window.angular;
const dependencies = [
    'ngMaterial'
];

const KrossoverConferenceSelect = angular.module(
    'KrossoverConferenceSelect',
    dependencies
);

KrossoverConferenceSelect.directive(
    'krossoverConferenceSelect',
    directive
);

export default KrossoverConferenceSelect;
