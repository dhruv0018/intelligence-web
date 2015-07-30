/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'play-summary.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * PlaySummaries
 * @module PlaySummaries
 */
var PlaySummaries = angular.module('PlaySummaries', []);

/* Cache the template file */
PlaySummaries.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

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

                let summaryEventsHTMLString = $sce.trustAsHtml(scope.play.summaryScript().join(''));

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
