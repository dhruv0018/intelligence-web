export default `

<div class="indexing-block">

    <form class="indexing-form" name="formIndexing" role="form" novalidate>

        <!-- Tags -->
        <div class="tags" data-ng-if="indexing.isIndexing && indexing.showTags">

            <button class="tag" data-ng-repeat="tag in tags.current" data-keybinding="{{ tag.shortcutKey.toLowerCase() }}" data-ng-click="indexing.selectTag(tag.id)" tabindex="{{ $index+1 }}">{{ tag.name }} ({{ tag.shortcutKey.toLowerCase() }})</button>

        </div>

        <!-- Script -->
        <div class="script" data-ng-if="indexing.isIndexing && indexing.showScript">
            <krossover-summary-item data-auto-advance="true" data-league="league" data-game="game" data-item="item" data-plays="indexing.plays" data-play="play.current" data-event="event.current" data-team-players="teamPlayers" data-opposing-team-players="opposingTeamPlayers" data-ng-repeat="item in event.current.indexerScript track by $index"></krossover-summary-item>
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
