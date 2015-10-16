export default `

<div class="indexing-block" ng-class="{ 'fullscreen': fullScreenEnabled }">

    <form class="indexing-form" name="formIndexing" role="form" novalidate>

        <!-- Tags -->
            <div class="tags" data-ng-if="indexing.isIndexing && indexing.showTags">

            <button class="tag" data-ng-repeat="tag in tags.current | tagRulesFilter track by $index" data-keybinding="{{ tag.keyboardShortcut.toLowerCase() }}" data-ng-click="indexing.selectTag(tag.id, game)" tabindex="{{ $index+1 }}">{{ tag.name }} ({{ tag.keyboardShortcut.toLowerCase() }})</button>

        </div>

        <!-- Script -->
        <indexer-fields
            ng-if="indexing.isIndexing && indexing.showScript"
            event="event.current"
            on-backward="backwards"
            on-forward="forwards"
        ></indexer-fields>
        <krossover-event-adjuster ng-if="indexing.isIndexing && indexing.showScript" play="play.current" plays="playsManager.plays" events="play.current.events" event="event.current" video="game.video"></krossover-event-adjuster>

        <div class="controls">

            <!-- Start button -->
            <button
                class="btn-indexing-start"
                ng-if="videoPlayer.isReady && !indexing.isIndexing"
                ng-click="indexing.index()"
            >
                <i class="icon icon-warning-sign"></i> Press <b>return</b> to index {{ videoPlayer.currentTime | time: true }}
            </button>

            <!-- State movement buttons -->
            <!-- TODO: Directivize -->
            <button
                class="btn-save"
                ng-show="indexing.isIndexing && indexing.showScript && event.current.isEnd"
                ng-click="indexing.save()"
                ng-disabled="!indexing.savable()"
                id="indexing-btn-save"
            >
                Save Event (Return)
            </button>
            <!-- TODO: Directivize -->
            <button
                class="btn-next"
                ng-show="indexing.isIndexing && indexing.showScript && !event.current.isEnd"
                ng-click="indexing.next()"
                ng-disabled="!indexing.nextable()"
                id="indexing-btn-next"
            >
                Next (Return)
            </button>

        </div>
    </form>
</div>

`;
