import PeriodFieldDefinition from './directive';

const Period = angular.module('Field.Period', []);

Period.directive('periodField', () => new PeriodFieldDefinition());

export default Period;
