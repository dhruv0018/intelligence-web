/* TODO: Remove a lot of the logic here for ngIfs; maybe move to PaginationList */

export default `

<button
    class="shift"
    ng-disabled="
        pages.currentPageNumber <= skipCount ||
        adminGamesService.isQuerying
    "
    ng-click="goBackSeveral();"
>&laquo;</button>
<button
    class="shift"
    ng-disabled="
        pages.currentPageNumber <= 1 ||
        adminGamesService.isQuerying
    "
    ng-click="goBackOne();"
>&lsaquo;</button>

<button
    class="page"
    ng-if="
        pages.currentPageNumber - numberOfAdjacentPageButtons >= 2 &&
        pages.totalPages > pages.subsetSize
    "
    ng-disabled="adminGamesService.isQuerying"
    ng-click="goToPage(pages.first);"
>1</button>
<span
    ng-if="
        pages.currentPageNumber - numberOfAdjacentPageButtons >= 3 &&
        pages.totalPages > pages.subsetSize
    "
    ng-disabled="adminGamesService.isQuerying"
>···</span>

<button
    class="page"
    ng-disabled="adminGamesService.isQuerying"
    ng-repeat="page in pages.subset track by $index"
    ng-class="{'active': pages.currentPageNumber === page.number}"
    ng-click="goToPage(page);"
>{{page.number}}</button>

<span
    ng-if="
        pages.currentPageNumber + numberOfAdjacentPageButtons < pages.totalPages - 1 &&
        pages.totalPages > pages.subsetSize
    "
    ng-disabled="adminGamesService.isQuerying"
>···</span>
<button
    class="page"
    ng-disabled="adminGamesService.isQuerying"
    ng-if="
        pages.currentPageNumber + numberOfAdjacentPageButtons < pages.totalPages &&
        pages.totalPages > pages.subsetSize
    "
    ng-click="goToPage(pages.last);"
>{{pages.totalPages}}</button>

<button
    class="shift"
    ng-disabled="
        pages.currentPageNumber >= pages.totalPages ||
        adminGamesService.isQuerying
    "
    ng-click="goForwardOne();"
>&rsaquo;</button>
<button
    class="shift"
    ng-disabled="
        pages.currentPageNumber >= pages.totalPages - skipCount ||
        adminGamesService.isQuerying
    "
    ng-click="goForwardSeveral();"
>&raquo;</button>

`;
