export default `

    <div class="custom">

        <h2>Custom Krossover Components</h2>

        <div id="arenas">

            <h3>Arenas</h3>

            <select
                ng-options="arenaId as arena.name for (arenaId, arena) in ARENA_TYPES"
                ng-model="selectedArenaId"
                ng-change="selectedArenaType = ARENA_TYPES[selectedArenaId].type"
            ></select>

            <krossover-arena
                type="selectedArenaType"
            ></krossover-arena>

            <krossover-event-adjuster></krossover-event-adjuster>
        </div>

    </div>
`;
