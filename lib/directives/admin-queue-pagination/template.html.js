export default `

<button
    class="shift"
    ng-disabled="paginationList.currentPageNumber <= skipCount"
    ng-click="goBackSeveral();"
>&laquo;</button>
<button
    class="shift"
    ng-disabled="paginationList.currentPageNumber <= 1"
    ng-click="goBackOne();"
>&lsaquo;</button>

<button
    ng-if="paginationList.currentPageNumber > numberOfAdjacentPageButtons"
    class="page"
    ng-click="goToPage(paginationList.first);"
>1</button>
<span
    ng-if="paginationList.currentPageNumber > numberOfAdjacentPageButtons"
>···</span>

<button
    class="page"
    ng-repeat="page in paginationList.subset track by $index"
    ng-class="{'active': paginationList.currentPageNumber === page.number}"
    ng-click="goToPage(page);"
>{{page.number}}</button>

<span
    ng-if="paginationList.currentPageNumber < paginationList.totalPages - numberOfAdjacentPageButtons"
>···</span>
<button
    class="page"
    ng-if="paginationList.currentPageNumber < paginationList.totalPages - numberOfAdjacentPageButtons"
    ng-click="goToPage(paginationList.last);"
>{{paginationList.totalPages}}</button>

<button
    class="shift"
    ng-disabled="paginationList.currentPageNumber >= paginationList.totalPages"
    ng-click="goForwardOne();"
>&rsaquo;</button>
<button
    class="shift"
    ng-disabled="paginationList.currentPageNumber >= paginationList.totalPages - skipCount"
    ng-click="goForwardSeveral();"
>&raquo;</button>

`;
