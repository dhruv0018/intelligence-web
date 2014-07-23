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
DynamicTable.directive('dynamicTable', [
    function directive() {

        var Table = {

            restrict: TO += ATTRIBUTES,

            scope: {
                source: '='
            },

            compile: compile

        };

        function compile(tElement, tAttrs, transclude) {
            return {
                pre: function preLink(scope, iElement, iAttrs, controller) {

                    var tableText = '';

                    function tableHeaderBuilder(obj) {

                        var nodes = obj;

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
                                    tableText += '>';
                                    tableText += node.label;
                                    tableText += '</th>';
                                }
                            }
                            tableText += '</tr>';
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
                            tableText += obj.label;
                            tableText += '</td>';
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
                        tableText += '<div class="table-responsive"><table class="fixed-table table table-bordered"><thead>';
                        tableHeaderBuilder(scope.source.header);
                        tableText += '</thead><tbody><tr>';
                        tableBodyBuilder(scope.source.body);
                        tableText = tableText.slice(0, -4); //remove leftover <tr>
                        tableText += '</tbody></table></div>';

                        //put a div in after the element??
                        tElement[0].innerHTML = tableText;
                    }
                },
                post: function postLink(scope, iElement, iAttrs, controller) {

                    iAttrs.$observe('visible', function(newValue) {
                        if (newValue === 'true') {
                            iElement[0].style.display = 'block';
                        } else if (newValue === 'false') {
                            iElement[0].style.display = 'none';
                        }
                    });
                }
            };
        }

        return Table;
    }
]);

