const angular = window.angular;

const StatsPrint = angular.module('StatsPrint', []);

StatsPrint.component('statsPrint', {
    template: `
        <a href="javascript:window.print()">
            <i class="icon icon-print"></i>Print
        </a>
    `
});

export default StatsPrint;
