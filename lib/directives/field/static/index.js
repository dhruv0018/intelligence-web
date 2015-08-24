var Static = angular.module('Field.Static', []);

let definition = {
    scope: {
        field: '='
    },
    template: '<span>{{field.value.name}}</span>'
};

Static.directive('staticField', () => definition);

export default Static;
