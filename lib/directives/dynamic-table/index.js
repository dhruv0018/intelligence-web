/* Constants */
var TO = '';
var ATTRIBUTES = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * DynamicTable
 * @module DynamicTable
 */
var DynamicTable = angular.module('DynamicTable', []);

/**
 * DynamicTable directive.
 * @module DynamicTable
 * @name DynamicTable
 * @type {directive}
 */
DynamicTable.directive('dynamicTable', ['$compile',
    function directive($compile) {

        var Table = {

            restrict: TO += ATTRIBUTES,

            scope: {
                source: '=',
                isFootball: '=?',
                glossary: '=?',
            },

            compile: compile

        };

        function preLink(scope, iElement, iAttrs, controller) {

            var tableText = '';

            function tableHeaderBuilder(nodes) {

                let count = 1;
                while (nodes.length) {
                    var nextLevel = [];
                    tableText += '<tr>';
                    for (var i = 0; i < nodes.length; i++) {
                        var node = nodes[i];

                        if (typeof node.label !== 'undefined') {
                            tableText += '<th';

                            var colspan = 1;
                            if (typeof node.children !== 'undefined') {
                                colspan = node.children.length;
                                if (Array.isArray(node.children)) nextLevel = nextLevel.concat(node.children);
                            }

                            if (colspan >= 1) tableText += ' colspan="' + colspan + '"';
                            tableText += ' class="css-tooltip top">';
                            tableText += node.label;

                            if(scope.glossary && scope.glossary[node.label]) {
                                tableText += '<span class="tooltiptext">';
                                tableText += scope.glossary[node.label] + '</span>';
                            }

                            tableText += '</th>';
                        }
                    }
                    tableText += '</tr>';
                    count++;
                    nodes = nextLevel;
                }

            }

            function tableBodyBuilder(obj) {

                if (typeof obj.label !== 'undefined') {
                    var rowspan = 1;
                    if (typeof obj.children !== 'undefined') {
                        rowspan = obj.children.length;
                    }
                    tableText += '<td';
                    if (rowspan > 1) tableText += ' rowspan="' + rowspan + '"';
                    tableText += '>';
                    tableText += '<div class="css-tooltip right">';
                    tableText += obj.label;

                    if(scope.glossary && scope.glossary[obj.label]) {
                        tableText += '<span class="tooltiptext">';
                        tableText += scope.glossary[obj.label] + '</span>';
                    }

                    tableText += '</div></td>';
                }

                if (Array.isArray(obj)) {
                    var retVal = false;
                    for (var i = 0; i < obj.length; i++) {
                        retVal = tableBodyBuilder(obj[i]);
                    }
                    return retVal;
                } else if (typeof obj.children !== 'undefined') {
                    if (tableBodyBuilder(obj.children)) {
                        tableText += '</tr><tr>';
                    }
                } else {
                    return true;
                }
            }

            scope.source = scope.source || {};

            if (scope.source.header && scope.source.body) {

                // Define the table opening tag with proper classes - this is used both for the visible fixed header
                // and invisible scrolling header so we define it here once for consistency.
                let tableDefinition = '<table class="fixed-table table table-bordered table-striped table-hover';
                if(scope.isFootball) {
                    tableDefinition += ' football';
                }
                tableDefinition += '">';

                // Visible, fixed header
                tableText += '<div class="table-responsive">';
                tableText += tableDefinition + '<thead>';
                tableHeaderBuilder(scope.source.header);
                tableText += '</thead></table>';

                // Full, scrolling table with invisible header used to size columns properly
                tableText += '<div class="table-body-container">';
                tableText += tableDefinition + '<thead class="hidden-header">';
                tableHeaderBuilder(scope.source.header);
                tableText += '</thead><tbody><tr>';
                tableBodyBuilder(scope.source.body);
                tableText = tableText.slice(0, -4); //remove leftover <tr>
                tableText += '</tbody></table></div></div>';

                return tableText;
            }
        }

        function compile(tElement, tAttrs, transclude) {
            return {
                pre: function(scope, iElement, iAttrs, controller) {
                    var tableText = preLink(scope, iElement, iAttrs, controller);
                    tElement[0].innerHTML = tableText;
                },
                post: function postLink(scope, iElement, iAttrs, controller) {
                    scope.$watch('source', function() {
                        var tableText = preLink(scope, iElement, iAttrs, controller);
                        iElement.html(tableText);
                    });

                    scope.$watch('glossary', function(newVal, oldVal) {
                        var tableText = preLink(scope, iElement, iAttrs, controller);
                        iElement.html(tableText);
                    });
                }
            };
        }

        return Table;
    }
]);
