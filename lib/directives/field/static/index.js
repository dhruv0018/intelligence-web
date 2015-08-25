import StaticFieldDefinition from './directive';

const StaticField = angular.module('Field.Static', []);

StaticField.directive('staticField', () => new StaticFieldDefinition());

export default StaticField;
