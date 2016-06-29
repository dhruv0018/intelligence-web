export default `
<div>
    <div class="playHeadingContainer" ng-click="openPlay(play)" ng-class="{'edit-mode': editFlag}">
        <check-box
            feature="SelectPlays"
            ng-if="isTeamMember"
            ng-hide="$root.viewport.name === VIEWPORTS.MOBILE.name || editFlag"
            checked="play.isSelected"
            ng-click="togglePlaySelection($event, play)">
        </check-box>

        <span
            class="watch-play"
            ng-hide="isIndexer || editFlag"
            id="play-play-cta"
            ng-click="watchPlay(play)"
            ng-class="{playing: play === playManager.current && videoPlayer.currentState === VG_STATES.PLAY}"
            >
            <i class="icon icon-play-circle"></i>
        </span>

        <div class="playHeading">

            <h4 ng-if="isIndexer">
                <span class="period">{{ league.periodAbbreviationLabel }} {{ play.period }}</span>
                <span class="dash"> — </span>
                <time>
                    {{ play.startTime | time: true }}
                    <span class="dash"> — </span>
                    {{ play.endTime | time: true }}
                </time>
            </h4>

            <h4 ng-if="isIndexer">
                <span class="team">{{ team.name }}</span>
                <span class="score">{{ play.indexedScore }}</span>
                <span class="vs">&nbsp;vs&nbsp;</span>
                <span class="score">{{ play.opposingIndexedScore }}</span>
                <span class="team">{{ opposingTeam.name }}</span>
            </h4>

            <h4 class="column" ng-if="!isIndexer && !isReelsPlay">

                <span class="playNumberAndTeam">
                    <span ng-show="play.number">{{play.number}}.&nbsp;</span>
                    {{teams[play.possessionTeamId].name}}
                </span>

                <div class="summariesContainer">

                    <krossover-play-summaries play="play"></krossover-play-summaries>

                </div>

            </h4>
            <div ng-if="!isIndexer && isReelsPlay">
                <h4 class="title">
                    <span ng-show="editFlag">{{play.index + 1}}.&nbsp;</span>
                    <krossover-play-summaries play="play"></krossover-play-summaries>
                    <span ng-if="!play.clip">
                        <time>
                            {{ play.startTime | time: true }}
                            <span class="dash"> — </span>
                            {{ play.endTime | time: true }}
                        </time>
                    </span>
                    <span class="dash">&nbsp;—&nbsp;&nbsp;</span>
                    <span class="datePlayed">{{game.datePlayed | dateTitle}}</span>
                </h4>

                <h5 class="subtitle">
                    <span class="teams">{{team.name}} vs {{opposingTeam.name}}</span>
                </h5>

                <span
                    ng-show="editFlag"
                    class="delete-reel-play"
                    ng-click="deleteReelPlay(play.index)"
                    >
                    <i class="icon icon-remove"></i>
                </span>
            </div>
        </div>

        <div class="playHeading-right" ng-hide="editFlag">

            <i class="icon play-label-icon icon-telestration pull-right" ng-hide="
                                                    isIndexer ||
                                                    !play.hasTelestrations"></i>

            <i class="icon play-label-icon icon-tag pull-right" ng-hide="
                                                    isIndexer ||
                                                    isReelsPlay ||
                                                    !play.customTagIds.length ||
                                                    !isTeamMember"></i>

            <span
                class="play-chevron"
            >
                <i class="icon icon-chevron-right"></i>
            </span>

        </div>

    </div>
</div>
`;
