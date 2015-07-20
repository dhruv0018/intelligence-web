/* Constants */
let TO = '';
const ELEMENTS = 'E';

/* Component resources */
const template = require('./template.html');
const templateUrl = 'koi-checkbox.html';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
* KOI Checkbox
* @module KOICheckbox
*/
const KOICheckbox = angular.module('KOICheckbox', []);

/* Cache the template file */
KOICheckbox.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
* KOICheckbox directive.
* @module KOICheckbox
* @name KOICheckbox
* @type {directive}
*/

KOICheckboxDirective.$inject = [
    '$parse'
];


/**
* KOI Checkbox
* @name koiCheckbox
*
* @description
* HTML checkbox, with 'select-all' with transclusion functionality (i.e. labels)
*
* @param {string} ngModel Assignable angular expression to data-bind to.
* @param {string=} childrenModels KOI Checkbox that act as children of this KOI Checkbox
* @param {string=} ngChange Angular expression to be executed when input changes due to user
* @param {string} reverse Reverse the order that the checkbox and transcluded content are displayed
* @param {string} filled Uses the filled style variant of the checkbox
* TODO
*   @param {string=} name Property name of the form under which the control is published.
*   @param {expression=} trueValue The value to which the expression should be set when selected.
*   @param {expression=} falseValue The value to which the expression should be set when not selected.
*   @param {expression=} determinantValue The value to which the expression should be when children are selected
*    interaction with the input element.
*
* @example

<div class="all">
  <koi-checkbox ng-model="allModel.value" children-models="childrenCheckboxModels" reverse="true" filled="true" name="all">
    <pre class="checkbox-labels">Select All</pre>
  </koi-checkbox>
</div>
<div class="choices">
  <div ng-repeat="fruit in fruits track by $index">
    <koi-checkbox ng-model="childrenCheckboxModels[$index]" class="child-checkbox">
      <div class="checkbox-labels">{{fruit}}</div>
    </koi-checkbox>
  </div>
</div>
*/
function KOICheckboxDirective($parse) {

    const DETERMINANT = -1;

    return {
        require: ['?ngModel'],
        restrict: TO += ELEMENTS,
        transclude: true,
        templateUrl: templateUrl,
        scope: true, // inherit scope data while creating new scope (protecting external scope data)
        link: {
            pre: function KOICheckboxDirectivePre(scope, element, attribute, controllers) {

                let linking = true;

                /* Get ngModel Controller */
                let ngModelController = controllers[0];
                scope.ngModelController = ngModelController;

                /* TODO: Fix using the true-value, false-value, determinant-value attributes */
                let trueValue = parseConstantExpr($parse, scope, 'trueValue', attribute.trueValue, true);
                let falseValue = parseConstantExpr($parse, scope, 'falseValue', attribute.falseValue, false);
                let determinantValue = parseConstantExpr($parse, scope, 'determinantValue', attribute.determinantValue, DETERMINANT);
                scope.trueValue = trueValue;
                scope.falseValue = falseValue;
                scope.determinantValue = determinantValue;

                /* Set default value */
                ngModelController.$setViewValue(falseValue);

                if (attribute.reverse) {
                    scope.reverse = true;
                }

                if (attribute.filled) {
                    scope.filled = true;
                }

                /* If the childrenModels are defined, add the 'SELECT ALL' checkbox functionality */
                if (attribute.childrenModels) {

                    scope.$watchCollection(attribute.childrenModels, childrenModelsWatch);
                }

                function childrenModelsWatch(newChildrenModels) {

                    if (linking) {
                        linking = false;
                        return;
                    }

                    let newChildrenModelsKeys = Object.keys(newChildrenModels);

                    let anyChecked = newChildrenModelsKeys.filter((key) => {

                        let model = newChildrenModels[key];
                        return !!model;
                    });

                    let newValue = anyChecked.length === newChildrenModelsKeys.length ? true : anyChecked.length ? DETERMINANT : false;

                    ngModelController.$setViewValue(newValue);
                }

                /* Define the the next View value states */
                let nextViewValue = {};
                nextViewValue[trueValue] = falseValue;
                nextViewValue[falseValue] = trueValue;
                nextViewValue[determinantValue] = trueValue; // From determinant state, next state is trueValue

                let listener = (event) => {

                    if (ngModelController.$viewValue === trueValue) {

                        ngModelController.$setViewValue(nextViewValue[trueValue], event && event.type);

                    } else if (ngModelController.$viewValue === falseValue) {

                        ngModelController.$setViewValue(nextViewValue[falseValue], event && event.type);

                    } else if (ngModelController.$viewValue === determinantValue) {

                        ngModelController.$setViewValue(nextViewValue[falseValue], event && event.type);
                    }
                };

                element.on('click', listener);

                // Override the standard `$isEmpty` because the $viewValue of an empty checkbox is always set to `false`
                // This is because of the parser below, which compares the `$modelValue` with `trueValue` to convert
                // it to a boolean.
                ngModelController.$isEmpty = (value) => {
                    return value === false;
                };

                ngModelController.$formatters.push((value) => {

                    /* TODO: Add in trueValue, falseValue, determinantValue formatting */

                    if (attribute.childrenModels) checkChildrenModels(value);

                    return !!value;
                });

                ngModelController.$parsers.push((value) => {

                    /* TODO: Add in trueValue, falseValue, determinantValue formatting */

                    if (attribute.childrenModels) checkChildrenModels(value);

                    return !!value;
                });

                function checkChildrenModels(value) {

                    if (!attribute.childrenModels) return;

                    let childrenModels = $parse(attribute.childrenModels)(scope);

                    if (value === trueValue) {

                        Object.keys(childrenModels).forEach((key) => {

                            childrenModels[key] = trueValue;
                        });

                    } else if (!value) {

                        Object.keys(childrenModels).forEach((key) => {

                            childrenModels[key] = falseValue;
                        });
                    }
                }
            }
        }
    };
}

function parseConstantExpr($parse, context, name, expression, fallback) {

    let parseFn;

    if (angular.isDefined(expression)) {

        parseFn = $parse(expression);

        if (!parseFn.constant) {

            throw new Error(`Expected constant expression for ${name}, but saw ${expression}`);
        }

        return parseFn(context);

    }

    return fallback;
}

KOICheckbox.directive('koiCheckbox', KOICheckboxDirective);
