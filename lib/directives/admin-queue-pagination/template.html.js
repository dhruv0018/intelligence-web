export default `

<button
    class="shift"
    ng-disabled="currentPage <= 0"
    ng-click="goBackSeveral();"
>&laquo;</button>
<button
    class="shift"
    ng-disabled="currentPage <= 0"
    ng-click="goBackOne();"
>&lsaquo;</button>

<button
    ng-if="currentPage > numberOfPageButtons"
    class="page"
    ng-click="goToPage(pages[0]);"
>1</button><span
    ng-if="currentPage > numberOfPageButtons + 1"
>···</span><button
    class="page"
    ng-repeat="page in getCurrentPageSubset() track by $index"
    ng-class="{'active': currentPage === page.number}"
    ng-click="goToPage(page);"
>{{page.viewNumber}}</button><span
    ng-if="currentPage < pages.length - numberOfPageButtons - 1"
>···</span><button
    class="page"
    ng-if="currentPage < pages.length - numberOfPageButtons - 1"
    ng-click="goToPage(pages[pages.length - 1]);"
>{{pages.length}}</button>

<button
    class="shift"
    ng-disabled="currentPage >= pages.length - 1"
    ng-click="goForwardOne();"
>&rsaquo;</button>
<button
    class="shift"
    ng-disabled="currentPage >= pages.length - 1"
    ng-click="goForwardSeveral();"
>&raquo;</button>

`;
