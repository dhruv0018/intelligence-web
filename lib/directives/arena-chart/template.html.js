export default `

<div class="arena-chart">

    <header>

        <div class="filters__helper">

            <count-label all-count="arenaChartController.arenaEvents.length" current-count="arenaChartController.filteredArenaEvents.length" label="Shots"></count-label>

            <div class="filter-pills">

                <pills pills="arenaChartController.activePills" pill-removed="arenaChartController.pillRemoved(pill)"></pills>

            </div>

            <button
                name="reset-filters"
                class="btn-blank btn-blank-primary layout--centered"
                ng-click="arenaChartController.resetFilters()"
                id="arena-chart-reset-filters-cta">

                <i class="icon icon-refresh"></i> Reset Filters
            </button>

        </div>

        <arena-chart-filters filter-model="arenaChartController.filters"></arena-chart-filters>

    </header>


    <main class="content-full">

        <div class="arena-chart-container">

            <krossover-arena type="arenaChartController.arenaType" fit-element>

                <arena-event
                    arena-event="arenaEvent"
                    ng-click="arenaChartController.onArenaEventClick($event, arenaEvent)"
                    ng-repeat="arenaEvent in arenaChartController.filteredArenaEvents = (arenaChartController.arenaEvents | arenaEvents:arenaChartController.filters)">
                </arena-event>

            </krossover-arena>

        </div>

    </main>

</div>

`;
