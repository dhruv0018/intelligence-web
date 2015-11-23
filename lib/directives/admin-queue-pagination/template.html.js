export default `

<button
    class="shift"
    ng-click="goToPage(0);"
>First</button>
<button
    class="shift"
    ng-click="goToPage(currentPage - 10);"
>&laquo;</button>
<button
    class="shift"
    ng-click="goToPage(currentPage - 1);"
>&lsaquo;</button>

<span
    class="continued-dots"
>&#8901;&#8901;&#8901;</span>

<button
    class="page"
    ng-repeat="page in getCurrentPageSubset() track by $index"
    ng-class="{'active': currentPage + 1 === page.number}"
    ng-click="goToPage(page.number);"
>{{page.number}}</button>

<span
    class="continued-dots"
>&#8901;&#8901;&#8901;</span>

<button
    class="shift"
    ng-click="goToPage(currentPage + 1);"
>&rsaquo;</button>
<button
    class="shift"
    ng-click="goToPage(currentPage + 10);"
>&raquo;</button>
<button
    class="shift"
    ng-click="goToPage(pages.length - 1);"
>Last</button>

`;
