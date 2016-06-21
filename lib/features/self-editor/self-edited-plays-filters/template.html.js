export default `
<div class="self-edited-plays-filter">
    <div class="filter-dropdown pull-left dropdown" dropdown is-open="filterMenu.isOpen">

        <a id="plays-filter-dropdown-toggle-cta" class="dropdown-toggle" dropdown-toggle>

            <span class="play-count">
                Viewing: {{plays.length}}&nbsp;&nbsp;
            </span>

            <span>
                Filter Plays
                <i class="icon icon-chevron-down"></i>
            </span>
        </a>

        <span ng-repeat="filter in activeFilters track by $index" class="btn btn-default active-filter">
            {{filter.value.name}}
            <i ng-click="removeActiveFilter($index)" class="icon icon-remove"></i>
        </span>

        <a ng-show="activeFilters.length > 0" ng-click="clearAll()">
            Clear
        </a>

        <ul class="dropdown-menu" ng-if="filterMenu.isOpen">
            <li class="force-scrollbar">
                <div>
                    <a class="btn btn-default" ng-click="showFilter($event, SELF_EDITOR_FILTERS.TAGS)"
                        ng-class="{'btn-primary':(SELF_EDITOR_FILTERS.TAGS == currentFilter)}">
                        Tags
                    </a>
                </div>
                <div>
                    <a class="btn btn-default" ng-click="showFilter($event, SELF_EDITOR_FILTERS.CREATED_BY)"
                        ng-class="{'btn-primary':(SELF_EDITOR_FILTERS.CREATED_BY == currentFilter)}">
                        Created by
                    </a>
                </div>
            </li>
            <li class="force-scrollbar">
                <input class="search-filter" ng-click="$event.stopPropagation()" ng-model="searchQuery" placeholder="Search Filters">
                <div ng-repeat="filterContent in matchingFilters = (filtersList[currentFilter] | filter:searchQuery) track by $index">
                    <a class="btn btn-default" ng-click="setActiveFilter(currentFilter, filterContent)"
                        ng-class="{'btn-primary':isFilterActive(currentFilter, filterContent)}">
                        {{filterContent.name}}
                    </a>
                </div>
                <no-results ng-if="!matchingFilters.length"></no-results>
            </li>
        </ul>
    </div>
</div>

`;
