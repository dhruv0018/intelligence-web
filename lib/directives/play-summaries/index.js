/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * PlaySummaries
 * @module PlaySummaries
 */
var PlaySummaries = angular.module('PlaySummaries', []);

/**
 * PlaySummaries directive.
 * @module PlaySummaries
 * @name PlaySummaries
 * @type {directive}
 */
PlaySummaries.directive('krossoverPlaySummaries', [
    '$sce',
    '$compile',
    function directive (
        $sce,
        $compile
    ) {

        var PlaySummaries = {

            link: function (scope, element) {

                let summaryEventsHTMLString = $sce.trustAsHtml(scope.play.summaryScript);

                let summaryHTMLString = `
                <div class="summaries">

                    ${summaryEventsHTMLString}

                </div>
                `;

                /* Compile Template String */
                element.html(summaryHTMLString);
                $compile(element.contents())(scope);
            },

            restrict: TO += ELEMENTS,

            scope: {

                play: '='
            }
        };

        return PlaySummaries;
    }
]);
