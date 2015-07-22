export default `

<div class="indexing-block" ng-class="{ 'fullscreen': fullScreenEnabled }">

    <form class="indexing-form" name="formIndexing" role="form" novalidate>

        <!-- Tags -->
            <div class="tags" data-ng-if="indexing.isIndexing && indexing.showTags">

            <button class="tag" data-ng-repeat="tag in tags.current" data-keybinding="{{ tag.keyboardShortcut.toLowerCase() }}" data-ng-click="indexing.selectTag(tag.id, game)" tabindex="{{ $index+1 }}">{{ tag.name }} ({{ tag.keyboardShortcut.toLowerCase() }})</button>

        </div>

        <!-- Script -->
        <!-- <div class="script" data-ng-if="indexing.isIndexing && indexing.showScript">
            <krossover-summary-item data-auto-advance="true" data-league="league" data-game="game" data-item="item" data-plays="indexing.plays" data-play="play.current" data-event="event.current" data-team-players="teamPlayers" data-opposing-team-players="opposingTeamPlayers" data-ng-repeat="item in event.current.indexerScript track by $index"></krossover-summary-item>
        </div> -->

        <div class="script">
            <span ng-repeat="scriptItem in event.current.indexerScript">
                <span ng-if="isString(scriptItem)"> {{scriptItem}}</span>
                <team-player-dropdown-field ng-if="scriptItem.type === 'PLAYER_TEAM_DROPDOWN' " event="event.current" field="event.current.fields[scriptItem.index]"></team-player-dropdown-field>
                <player-dropdown-field ng-if="scriptItem.type === 'PLAYER_DROPDOWN' " event="event.current" field="event.current.fields[scriptItem.index]"></player-dropdown-field>
                <team-dropdown-field ng-if="scriptItem.type === 'TEAM_DROPDOWN'" event="event.current" field="event.current.fields[scriptItem.index]"></team-dropdown-field>
                <gap-dropdown-field ng-if="scriptItem.type === 'GAP'" event="event.current" field="event.current.fields[scriptItem.index]"></gap-dropdown-field>
                <formation-dropdown-field ng-if="scriptItem.type === 'FORMATION'" event="event.current" field="event.current.fields[scriptItem.index]"></formation-dropdown-field>
                <passing-zone-dropdown-field ng-if="scriptItem.type === 'PASSING_ZONE'" event="event.current" field="event.current.fields[scriptItem.index]"></passing-zone-dropdown-field>
                <text-dropdown-field ng-if="scriptItem.type === 'TEXT'" event="event.current" field="event.current.fields[scriptItem.index]"></text-dropdown-field>
                <yard-dropdown-field ng-if="scriptItem.type === 'YARD'" event="event.current" field="event.current.fields[scriptItem.index]"></yard-dropdown-field>
                <arena-dropdown-field ng-if="scriptItem.type === 'ARENA'" event="event.current" field="event.current.fields[scriptItem.index]"></arena-dropdown-field>
                <dropdown-field ng-if="scriptItem.type === 'DROPDOWN'" event="event.current" field="event.current.fields[scriptItem.index]"></dropdown-field>
            </span>
        </div>

        <div class="controls">

            <!-- Start button -->
            <button class="btn-indexing-start" data-ng-if="videoPlayer.isReady && !indexing.isIndexing" data-ng-click="indexing.index()"><i class="icon icon-warning-sign"></i> Press <b>return</b> to index {{ videoPlayer.currentTime | time }}</button>

            <!-- State movement buttons -->
            <button class="btn-save" data-ng-if="indexing.isIndexing && indexing.showScript && event.current.isEnd" data-ng-click="indexing.save()" data-ng-disabled="!indexing.savable() || formIndexing.$invalid">Save Event (Return)</button>
            <button class="btn-next" data-ng-if="indexing.isIndexing && indexing.showScript && !event.current.isEnd" data-ng-click="indexing.next()" data-ng-disabled="!indexing.nextable() || formIndexing.$invalid">Next (Return)</button>

        </div>
    </form>
</div>

`;
