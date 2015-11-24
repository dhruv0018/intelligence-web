export default `

<button
    class="shift"
    ng-click="goToPage(currentPage - 10);"
>&laquo;</button>
<button
    class="shift"
    ng-click="goToPage(currentPage - 1);"
>&lsaquo;</button>

<button
    ng-if="currentPage > numberOfPageButtons"
    class="page"
    ng-click="goToPage(0);"
>1</button>

<span
    ng-if="currentPage > numberOfPageButtons + 1"
>···</span>

<button
    class="page"
    ng-repeat="page in getCurrentPageSubset() track by $index"
    ng-class="{'active': currentPage === page.number}"
    ng-click="goToPage(page.number);"
>{{page.viewNumber}}</button>

<span
    ng-if="currentPage < pages.length - numberOfPageButtons - 1"
>···</span>

<button
    class="page"
    ng-if="currentPage < pages.length - numberOfPageButtons - 1"
    ng-click="goToPage(pages.length - 1);"
>{{pages.length}}</button>

<button
    class="shift"
    ng-click="goToPage(currentPage + 1);"
>&rsaquo;</button>
<button
    class="shift"
    ng-click="goToPage(currentPage + 10);"
>&raquo;</button>

`;
