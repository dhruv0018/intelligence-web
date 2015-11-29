/* TODO: Remove a lot of the logic here for ngIfs; maybe move to PaginationList */

export default `

<button
    class="shift"
    ng-disabled="
        pages.currentPageNumber <= skipCount ||
        paginationDisabled
    "
    ng-click="goBackSeveral();"
>&laquo;</button>
<button
    class="shift"
    ng-disabled="
        pages.currentPageNumber <= 1 ||
        paginationDisabled
    "
    ng-click="goBackOne();"
>&lsaquo;</button>

<button
    class="page"
    ng-if="
        pages.currentPageNumber > numberOfAdjacentPageButtons &&
        pages.totalPages > pages.subsetSize
    "
    ng-disabled="paginationDisabled"
    ng-click="goToPage(pages.first);"
>1</button>
<span
    ng-if="
        pages.currentPageNumber > numberOfAdjacentPageButtons &&
        pages.totalPages > pages.subsetSize
    "
    ng-disabled="paginationDisabled"
>···</span>

<button
    class="page"
    ng-disabled="paginationDisabled"
    ng-repeat="page in pages.subset track by $index"
    ng-class="{'active': pages.currentPageNumber === page.number}"
    ng-click="goToPage(page);"
>{{page.number}}</button>

<span
    ng-if="
        pages.currentPageNumber < pages.totalPages - numberOfAdjacentPageButtons &&
        pages.totalPages > pages.subsetSize
    "
    ng-disabled="paginationDisabled"
>···</span>
<button
    class="page"
    ng-disabled="paginationDisabled"
    ng-if="
        pages.currentPageNumber < pages.totalPages - numberOfAdjacentPageButtons &&
        pages.totalPages > pages.subsetSize
    "
    ng-click="goToPage(pages.last);"
>{{pages.totalPages}}</button>

<button
    class="shift"
    ng-disabled="
        pages.currentPageNumber >= pages.totalPages ||
        paginationDisabled
    "
    ng-click="goForwardOne();"
>&rsaquo;</button>
<button
    class="shift"
    ng-disabled="
        pages.currentPageNumber >= pages.totalPages - skipCount ||
        paginationDisabled
    "
    ng-click="goForwardSeveral();"
>&raquo;</button>

`;
