export default `

<button
    class="shift"
    ng-disabled="pages.currentPageNumber <= skipCount"
    ng-click="goBackSeveral();"
>&laquo;</button>
<button
    class="shift"
    ng-disabled="pages.currentPageNumber <= 1"
    ng-click="goBackOne();"
>&lsaquo;</button>

<button
    ng-if="pages.currentPageNumber > numberOfAdjacentPageButtons"
    class="page"
    ng-click="goToPage(pages.first);"
>1</button>
<span
    ng-if="pages.currentPageNumber > numberOfAdjacentPageButtons"
>···</span>

<button
    class="page"
    ng-repeat="page in pages.subset track by $index"
    ng-class="{'active': pages.currentPageNumber === page.number}"
    ng-click="goToPage(page);"
>{{page.number}}</button>

<span
    ng-if="pages.currentPageNumber < pages.totalPages - numberOfAdjacentPageButtons"
>···</span>
<button
    class="page"
    ng-if="pages.currentPageNumber < pages.totalPages - numberOfAdjacentPageButtons"
    ng-click="goToPage(pages.last);"
>{{pages.totalPages}}</button>

<button
    class="shift"
    ng-disabled="pages.currentPageNumber >= pages.totalPages"
    ng-click="goForwardOne();"
>&rsaquo;</button>
<button
    class="shift"
    ng-disabled="pages.currentPageNumber >= pages.totalPages - skipCount"
    ng-click="goForwardSeveral();"
>&raquo;</button>

`;
